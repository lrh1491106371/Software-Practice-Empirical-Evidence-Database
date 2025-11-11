import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument, ArticleStatus } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async create(createArticleDto: CreateArticleDto, userId: string): Promise<ArticleDocument> {
    // Check for duplicate DOI if provided
    if (createArticleDto.doi) {
      const existing = await this.articleModel.findOne({ doi: createArticleDto.doi }).exec();
      if (existing) {
        throw new ForbiddenException('Article with this DOI already exists');
      }
    }

    const createdArticle = new this.articleModel({
      ...createArticleDto,
      submittedBy: userId,
      status: ArticleStatus.PENDING_REVIEW,
    });

    return createdArticle.save();
  }

  async findAll(status?: ArticleStatus): Promise<ArticleDocument[]> {
    const query = status ? { status } : {};
    return this.articleModel.find(query).populate('submittedBy', 'firstName lastName email').exec();
  }

  async findOne(id: string): Promise<ArticleDocument> {
    const article = await this.articleModel
      .findById(id)
      .populate('submittedBy', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName')
      .populate('analyzedBy', 'firstName lastName')
      .exec();
    
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    
    return article;
  }

  async findBySubmitter(userId: string): Promise<ArticleDocument[]> {
    return this.articleModel
      .find({ submittedBy: userId })
      .populate('submittedBy', 'firstName lastName email')
      .exec();
  }

  async findPendingReview(): Promise<ArticleDocument[]> {
    return this.articleModel
      .find({ status: ArticleStatus.PENDING_REVIEW })
      .populate('submittedBy', 'firstName lastName email')
      .exec();
  }

  async findPendingAnalysis(): Promise<ArticleDocument[]> {
    return this.articleModel
      .find({ status: ArticleStatus.PENDING_ANALYSIS })
      .populate('submittedBy', 'firstName lastName email')
      .exec();
  }

  async update(id: string, updateArticleDto: UpdateArticleDto, userId: string, userRoles: string[]): Promise<ArticleDocument> {
    const article = await this.articleModel.findById(id).exec();
    
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    // Only allow submitter to edit if status is PENDING_REVIEW and they are the submitter
    const isAdmin = userRoles.includes('admin');
    const isSubmitter = article.submittedBy.toString() === userId;
    const canEdit = isAdmin || (isSubmitter && article.status === ArticleStatus.PENDING_REVIEW);

    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to edit this article');
    }

    const updatedArticle = await this.articleModel
      .findByIdAndUpdate(id, updateArticleDto, { new: true })
      .populate('submittedBy', 'firstName lastName email')
      .exec();

    return updatedArticle;
  }

  async approve(id: string, reviewerId: string): Promise<ArticleDocument> {
    const article = await this.articleModel.findById(id).exec();
    
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    if (article.status !== ArticleStatus.PENDING_REVIEW) {
      throw new ForbiddenException('Article is not in pending review status');
    }

    article.status = ArticleStatus.PENDING_ANALYSIS;
    article.reviewedBy = reviewerId as any;
    article.reviewedAt = new Date();

    return article.save();
  }

  async reject(id: string, reviewerId: string, reason?: string): Promise<ArticleDocument> {
    const article = await this.articleModel.findById(id).exec();
    
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    if (article.status !== ArticleStatus.PENDING_REVIEW) {
      throw new ForbiddenException('Article is not in pending review status');
    }

    article.status = ArticleStatus.REJECTED;
    article.reviewedBy = reviewerId as any;
    article.reviewedAt = new Date();
    article.rejectionReason = reason;

    return article.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.articleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
  }

  async search(query: string): Promise<ArticleDocument[]> {
    return this.articleModel
      .find({ $text: { $search: query } })
      .populate('submittedBy', 'firstName lastName email')
      .exec();
  }

  async rateArticle(id: string, userId: string, value: number): Promise<ArticleDocument> {
    if (value < 1 || value > 5) {
      throw new ForbiddenException('Rating must be between 1 and 5');
    }
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    const ratings = article.ratings || [];
    const existingIndex = ratings.findIndex((r) => r.userId?.toString() === userId);
    if (existingIndex >= 0) {
      ratings[existingIndex].value = value as any;
    } else {
      ratings.push({ userId: userId as any, value });
    }
    const avg =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + (r.value || 0), 0) / ratings.length
        : 0;
    article.ratings = ratings as any;
    article.averageRating = Number(avg.toFixed(2));
    await article.save();
    return article;
  }
}

