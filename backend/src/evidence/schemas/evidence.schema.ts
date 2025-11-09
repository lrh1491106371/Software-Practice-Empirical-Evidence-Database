import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EvidenceDocument = Evidence & Document;

export enum EvidenceResult {
  SUPPORTS = 'supports',
  OPPOSES = 'opposes',
  NEUTRAL = 'neutral',
}

export enum ResearchType {
  CASE_STUDY = 'case_study',
  EXPERIMENT = 'experiment',
  SURVEY = 'survey',
  SYSTEMATIC_REVIEW = 'systematic_review',
  META_ANALYSIS = 'meta_analysis',
  OTHER = 'other',
}

export enum ParticipantType {
  STUDENTS = 'students',
  PROFESSIONALS = 'professionals',
  MIXED = 'mixed',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Evidence {
  @Prop({ type: Types.ObjectId, ref: 'Article', required: true, unique: true })
  articleId: Types.ObjectId;

  @Prop({ required: true })
  sePractice: string;

  @Prop({ required: true })
  claim: string;

  @Prop({
    type: String,
    enum: Object.values(EvidenceResult),
    required: true,
  })
  evidenceResult: EvidenceResult;

  @Prop({
    type: String,
    enum: Object.values(ResearchType),
    required: true,
  })
  researchType: ResearchType;

  @Prop({
    type: String,
    enum: Object.values(ParticipantType),
    required: true,
  })
  participantType: ParticipantType;

  @Prop()
  participantCount?: number;

  @Prop()
  summary?: string;

  @Prop()
  notes?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  analyzedBy: Types.ObjectId;

  @Prop({ default: false })
  isPublished: boolean;
}

export const EvidenceSchema = SchemaFactory.createForClass(Evidence);

// Indexes
EvidenceSchema.index({ articleId: 1 });
EvidenceSchema.index({ sePractice: 1 });
EvidenceSchema.index({ claim: 1 });
EvidenceSchema.index({ evidenceResult: 1 });

