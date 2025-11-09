import { IsString, IsNumber, IsOptional, IsArray, IsUrl, Min, Max } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsArray()
  @IsString({ each: true })
  authors: string[];

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  publicationYear: number;

  @IsOptional()
  @IsString()
  doi?: string;

  @IsOptional()
  @IsString()
  journalName?: string;

  @IsOptional()
  @IsString()
  volume?: string;

  @IsOptional()
  @IsString()
  pages?: string;

  @IsOptional()
  @IsString()
  abstract?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  bibtexData?: Record<string, any>;
}

