import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evidence, EvidenceDocument } from './schemas/evidence.schema';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenceDto } from './dto/update-evidence.dto';
import { ArticlesService } from '../articles/articles.service';
import { ArticleStatus } from '../articles/schemas/article.schema';

@Injectable()
export class EvidenceService {
  constructor(
    @InjectModel(Evidence.name) private evidenceModel: Model<EvidenceDocument>,
    private articlesService: ArticlesService,
  ) {}

  async create(createEvidenceDto: CreateEvidenceDto, userId: string): Promise<EvidenceDocument> {
    // Check if article exists and is approved
    const article = await this.articlesService.findOne(createEvidenceDto.articleId);
    
    if (article.status !== ArticleStatus.APPROVED && article.status !== ArticleStatus.PENDING_ANALYSIS) {
      throw new ConflictException('Article must be approved before evidence can be added');
    }

    // Check if evidence already exists for this article
    const existing = await this.evidenceModel.findOne({ articleId: createEvidenceDto.articleId }).exec();
    if (existing) {
      throw new ConflictException('Evidence already exists for this article');
    }

    const createdEvidence = new this.evidenceModel({
      ...createEvidenceDto,
      analyzedBy: userId,
    });

    const savedEvidence = await createdEvidence.save();

    // Update article status to analyzed
    await this.articlesService.update(
      createEvidenceDto.articleId,
      { status: ArticleStatus.ANALYZED } as any,
      userId,
      ['analyst', 'admin'],
    );

    return savedEvidence;
  }

  async findAll(): Promise<EvidenceDocument[]> {
    return this.evidenceModel
      .find()
      .populate('articleId')
      .populate('analyzedBy', 'firstName lastName email')
      .exec();
  }

  async findOne(id: string): Promise<EvidenceDocument> {
    const evidence = await this.evidenceModel
      .findById(id)
      .populate('articleId')
      .populate('analyzedBy', 'firstName lastName email')
      .exec();
    
    if (!evidence) {
      throw new NotFoundException(`Evidence with ID ${id} not found`);
    }
    
    return evidence;
  }

  async findByArticle(articleId: string): Promise<EvidenceDocument[]> {
    return this.evidenceModel
      .find({ articleId })
      .populate('articleId')
      .populate('analyzedBy', 'firstName lastName email')
      .exec();
  }

  async findBySEPractice(sePractice: string): Promise<EvidenceDocument[]> {
    return this.evidenceModel
      .find({ sePractice })
      .populate('articleId')
      .populate('analyzedBy', 'firstName lastName email')
      .exec();
  }

  async update(id: string, updateEvidenceDto: UpdateEvidenceDto, userId: string): Promise<EvidenceDocument> {
    const updatedEvidence = await this.evidenceModel
      .findByIdAndUpdate(id, updateEvidenceDto, { new: true })
      .populate('articleId')
      .populate('analyzedBy', 'firstName lastName email')
      .exec();
    
    if (!updatedEvidence) {
      throw new NotFoundException(`Evidence with ID ${id} not found`);
    }
    
    return updatedEvidence;
  }

  async remove(id: string): Promise<void> {
    const result = await this.evidenceModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Evidence with ID ${id} not found`);
    }
  }
}

