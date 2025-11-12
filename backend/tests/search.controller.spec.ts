import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from '../src/search/search.controller';
import { SearchService } from '../src/search/search.service';

// Mock SearchService
const mockSearchService = {
  searchArticles: jest.fn(),
  searchBySEPractice: jest.fn(),
  searchByClaim: jest.fn(),
  searchAdvanced: jest.fn(),
};

describe('SearchController', () => {
  let controller: SearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    jest.clearAllMocks();
  });

  describe('searchArticles', () => {
    it('should return [] for empty query and call service with empty string', async () => {
      mockSearchService.searchArticles.mockResolvedValue([]);
      const res = await controller.searchArticles('');
      expect(mockSearchService.searchArticles).toHaveBeenCalledWith('');
      expect(res).toEqual([]);
    });

    it('should forward query to service', async () => {
      const sample = [{ title: 'A' }];
      mockSearchService.searchArticles.mockResolvedValue(sample);
      const res = await controller.searchArticles('nestjs');
      expect(mockSearchService.searchArticles).toHaveBeenCalledWith('nestjs');
      expect(res).toEqual(sample);
    });
  });

  describe('searchBySEPractice', () => {
    it('should call service with practice', async () => {
      const sample = [{ sePractice: 'TDD' }];
      mockSearchService.searchBySEPractice.mockResolvedValue(sample);
      const res = await controller.searchBySEPractice('TDD');
      expect(mockSearchService.searchBySEPractice).toHaveBeenCalledWith('TDD');
      expect(res).toEqual(sample);
    });
  });

  describe('searchByClaim', () => {
    it('should call service with claim', async () => {
      const sample = [{ claim: 'X' }];
      mockSearchService.searchByClaim.mockResolvedValue(sample);
      const res = await controller.searchByClaim('Test');
      expect(mockSearchService.searchByClaim).toHaveBeenCalledWith('Test');
      expect(res).toEqual(sample);
    });
  });

  describe('searchAdvanced', () => {
    it('should forward advanced parameters as object', async () => {
      const sample = [{ title: 'Advanced' }];
      mockSearchService.searchAdvanced.mockResolvedValue(sample);

      const res = await controller.searchAdvanced('q', 'TDD', 'claim', 2020, 2021, 'positive');

      expect(mockSearchService.searchAdvanced).toHaveBeenCalledWith({
        query: 'q',
        sePractice: 'TDD',
        claim: 'claim',
        yearFrom: 2020,
        yearTo: 2021,
        evidenceResult: 'positive',
      });
      expect(res).toEqual(sample);
    });

    it('should handle partial/undefined advanced params', async () => {
      mockSearchService.searchAdvanced.mockResolvedValue([]);
      const res = await controller.searchAdvanced('q', undefined, undefined, undefined, undefined, undefined);
      expect(mockSearchService.searchAdvanced).toHaveBeenCalledWith({
        query: 'q',
        sePractice: undefined,
        claim: undefined,
        yearFrom: undefined,
        yearTo: undefined,
        evidenceResult: undefined,
      });
      expect(res).toEqual([]);
    });
  });
});