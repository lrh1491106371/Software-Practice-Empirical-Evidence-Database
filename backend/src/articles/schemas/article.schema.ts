import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ArticleDocument = Article & Document;

export enum ArticleStatus {
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING_ANALYSIS = 'pending_analysis',
  ANALYZED = 'analyzed',
  PUBLISHED = 'published',
}

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: [String] })
  authors: string[];

  @Prop({ required: true })
  publicationYear: number;

  @Prop({ unique: true, sparse: true })
  doi?: string;

  @Prop()
  journalName?: string;

  @Prop()
  volume?: string;

  @Prop()
  pages?: string;

  @Prop()
  abstract?: string;

  @Prop()
  url?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  submittedBy: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(ArticleStatus),
    default: ArticleStatus.PENDING_REVIEW,
  })
  status: ArticleStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy?: Types.ObjectId;

  @Prop()
  reviewedAt?: Date;

  @Prop()
  rejectionReason?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  analyzedBy?: Types.ObjectId;

  @Prop()
  analyzedAt?: Date;

  // Bibtex raw data (optional)
  @Prop({ type: Object })
  bibtexData?: Record<string, any>;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

// Indexes for faster queries
ArticleSchema.index({ title: 'text', abstract: 'text' });
ArticleSchema.index({ status: 1 });
ArticleSchema.index({ submittedBy: 1 });
ArticleSchema.index({ publicationYear: 1 });
ArticleSchema.index({ doi: 1 });

