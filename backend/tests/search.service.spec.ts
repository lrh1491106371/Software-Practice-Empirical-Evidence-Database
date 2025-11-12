import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SearchService } from '../src/search/search.service';
import { Article } from '../src/articles/schemas/article.schema';
import { Evidence } from '../src/evidence/schemas/evidence.schema';

describe('SearchService (unit)', () => {
  let service: SearchService;
  let articleModelMock: any;
  let evidenceModelMock: any;

  beforeEach(async () => {
    const createChainableMock = (execResult: any) => ({
      populate: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(execResult),
    });

    articleModelMock = {
      find: jest.fn(() => createChainableMock([])),
    };

    evidenceModelMock = {
      find: jest.fn(() => createChainableMock([])),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: getModelToken(Article.name),
          useValue: articleModelMock,
        },
        {
          provide: getModelToken(Evidence.name),
          useValue: evidenceModelMock,
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchArticles', () => {
    it('returns [] for empty or whitespace query', async () => {
      const res1 = await service.searchArticles('');
      const res2 = await service.searchArticles('   ');
      expect(res1).toEqual([]);
      expect(res2).toEqual([]);
      expect(articleModelMock.find).not.toHaveBeenCalled();
    });

    it('queries articleModel with regex and status', async () => {
      const sampleArticles = [
        { title: 'Test Article 1', status: 'analyzed' },
        { title: 'Test Article 2', status: 'published' }
      ];
      
      const chainableMock = {
        populate: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(sampleArticles),
      };
      articleModelMock.find.mockReturnValueOnce(chainableMock);

      const query = 'software';
      const res = await service.searchArticles(query);

      expect(articleModelMock.find).toHaveBeenCalled();
      
      const findCall = articleModelMock.find.mock.calls[0];
      expect(findCall).toBeDefined();
      
      const calledArg = findCall[0];
      expect(calledArg).toBeDefined();
      
      expect(calledArg).toHaveProperty('status');
      expect(calledArg.status).toEqual({ $in: ['analyzed', 'published'] });
      expect(Array.isArray(calledArg.$or)).toBe(true);
      expect(calledArg.$or).toHaveLength(2);
      expect(calledArg.$or[0]).toEqual({ title: { $regex: query, $options: 'i' } });
      expect(calledArg.$or[1]).toEqual({ abstract: { $regex: query, $options: 'i' } });
      
      expect(chainableMock.populate).toHaveBeenCalledWith('submittedBy', 'firstName lastName email');
      expect(chainableMock.limit).toHaveBeenCalledWith(50);
      expect(chainableMock.exec).toHaveBeenCalled();
      
      expect(res).toEqual(sampleArticles);
    });
  });

  describe('searchBySEPractice', () => {
    it('calls evidenceModel.find with sePractice', async () => {
      const sample = [{ _id: 'e1', sePractice: 'TDD', articleId: {} }];
      const chainableMock = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(sample),
      };
      evidenceModelMock.find.mockReturnValueOnce(chainableMock);

      const res = await service.searchBySEPractice('TDD');
      
      expect(evidenceModelMock.find).toHaveBeenCalledWith({ sePractice: 'TDD' });
      
      expect(chainableMock.populate).toHaveBeenCalledWith({
        path: 'articleId',
        populate: { path: 'submittedBy', select: 'firstName lastName email' },
      });
      expect(chainableMock.populate).toHaveBeenCalledWith('analyzedBy', 'firstName lastName email');
      
      expect(res).toEqual(sample);
    });
  });

  describe('searchByClaim', () => {
    it('uses regex $options i', async () => {
      const sample = [{ _id: 'e2', claim: 'improves quality', articleId: {} }];
      const chainableMock = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(sample),
      };
      evidenceModelMock.find.mockReturnValueOnce(chainableMock);

      const claimQuery = 'improves quality';
      const res = await service.searchByClaim(claimQuery);
      
      expect(evidenceModelMock.find).toHaveBeenCalled();
      
      const findCall = evidenceModelMock.find.mock.calls[0];
      expect(findCall).toBeDefined();
      
      const firstArg = findCall[0];
      expect(firstArg).toBeDefined();
      expect(firstArg).toHaveProperty('claim');
      expect(firstArg.claim).toEqual({ 
        $regex: claimQuery, 
        $options: 'i' 
      });
      
      expect(res).toEqual(sample);
    });
  });

  describe('searchAdvanced', () => {
    it('builds queries and filters out null articleId', async () => {
      const evidences = [
        { _id: 'e1', articleId: { title: 'A', publicationYear: 2021 } },
        { _id: 'e2', articleId: null },
      ];
      
      const populateMock = jest.fn().mockReturnThis();
      const execMock = jest.fn().mockResolvedValue(evidences);
      
      evidenceModelMock.find.mockReturnValueOnce({
        populate: populateMock,
        exec: execMock,
      });

      const filters = {
        query: 'software',
        sePractice: 'TDD',
        claim: 'quality',
        yearFrom: 2020,
        yearTo: 2022,
        evidenceResult: 'supports',
      };

      const res = await service.searchAdvanced(filters);

      expect(evidenceModelMock.find).toHaveBeenCalledWith({
        sePractice: 'TDD',
        claim: { $regex: 'quality', $options: 'i' },
        evidenceResult: 'supports',
      });

      expect(populateMock).toHaveBeenCalled();
      const populateCall = populateMock.mock.calls[0];
      expect(populateCall[0]).toEqual({
        path: 'articleId',
        match: {
          $or: [
            { title: { $regex: 'software', $options: 'i' } },
            { abstract: { $regex: 'software', $options: 'i' } },
          ],
          publicationYear: {
            $gte: 2020,
            $lte: 2022,
          },
        },
        populate: { path: 'submittedBy', select: 'firstName lastName email' },
      });

      expect(Array.isArray(res)).toBe(true);
      expect(res).toHaveLength(1);
      expect(res[0]._id).toBe('e1');
      expect(res[0].articleId).toBeDefined();
    });

    it('handles partial filters', async () => {
      const evidences = [{ _id: 'e1', articleId: { title: 'Test' } }];
      
      evidenceModelMock.find.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(evidences),
      });

      const res = await service.searchAdvanced({
        query: 'test',
      });

      expect(evidenceModelMock.find).toHaveBeenCalledWith({});
      expect(res).toEqual(evidences);
    });
  });
});