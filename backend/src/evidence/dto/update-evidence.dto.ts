import { PartialType } from '@nestjs/mapped-types';
import { CreateEvidenceDto } from './create-evidence.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateEvidenceDto extends PartialType(CreateEvidenceDto) {
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

