import { IsString, IsEnum, IsOptional, IsNumber, IsMongoId, Min } from 'class-validator';
import { EvidenceResult, ResearchType, ParticipantType } from '../schemas/evidence.schema';

export class CreateEvidenceDto {
  @IsMongoId()
  articleId: string;

  @IsString()
  sePractice: string;

  @IsString()
  claim: string;

  @IsEnum(EvidenceResult)
  evidenceResult: EvidenceResult;

  @IsEnum(ResearchType)
  researchType: ResearchType;

  @IsEnum(ParticipantType)
  participantType: ParticipantType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  participantCount?: number;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

