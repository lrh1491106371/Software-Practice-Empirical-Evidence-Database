import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../articles/schemas/article.schema';
import { Evidence, EvidenceDocument } from '../evidence/schemas/evidence.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(Evidence.name) private evidenceModel: Model<EvidenceDocument>,
  ) {}

  async searchArticles(query: string): Promise<ArticleDocument[]> {
    if (!query || query.trim() === '') {
      return [];
    }

    return this.articleModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { abstract: { $regex: query, $options: 'i' } },
        ],
        status: { $in: ['analyzed', 'published'] },
      })
      .populate('submittedBy', 'firstName lastName email')
      .limit(50)
      .exec();
  }

  async searchBySEPractice(sePractice: string): Promise<any[]> {
    const evidence = await this.evidenceModel
      .find({ sePractice })
      .populate({
        path: 'articleId',
        populate: { path: 'submittedBy', select: 'firstName lastName email' },
      })
      .populate('analyzedBy', 'firstName lastName email')
      .exec();

    return evidence;
  }

  async searchByClaim(claim: string): Promise<any[]> {
    const evidence = await this.evidenceModel
      .find({ claim: { $regex: claim, $options: 'i' } })
      .populate({
        path: 'articleId',
        populate: { path: 'submittedBy', select: 'firstName lastName email' },
      })
      .populate('analyzedBy', 'firstName lastName email')
      .exec();

    return evidence;
  }

  async searchAdvanced(filters: {
    query?: string;
    sePractice?: string;
    claim?: string;
    yearFrom?: number;
    yearTo?: number;
    evidenceResult?: string;
  }): Promise<any[]> {
    const { query, sePractice, claim, yearFrom, yearTo, evidenceResult } = filters;

    const evidenceQuery: any = {};

    if (sePractice) {
      evidenceQuery.sePractice = sePractice;
    }

    if (claim) {
      evidenceQuery.claim = { $regex: claim, $options: 'i' };
    }

    if (evidenceResult) {
      evidenceQuery.evidenceResult = evidenceResult;
    }

    const articleQuery: any = {};

    if (yearFrom || yearTo) {
      articleQuery.publicationYear = {};
      if (yearFrom) articleQuery.publicationYear.$gte = yearFrom;
      if (yearTo) articleQuery.publicationYear.$lte = yearTo;
    }

    if (query) {
      articleQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { abstract: { $regex: query, $options: 'i' } },
      ];
    }

    const evidence = await this.evidenceModel
      .find(evidenceQuery)
      .populate({
        path: 'articleId',
        match: articleQuery,
        populate: { path: 'submittedBy', select: 'firstName lastName email' },
      })
      .populate('analyzedBy', 'firstName lastName email')
      .exec();

    // Filter out null articleIds (from populate match)
    return evidence.filter((e) => e.articleId);
  }
}

