import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { EvidenceService } from './evidence.service';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenceDto } from './dto/update-evidence.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('evidence')
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ANALYST, UserRole.ADMIN)
  create(@Body() createEvidenceDto: CreateEvidenceDto, @Request() req) {
    return this.evidenceService.create(createEvidenceDto, req.user.userId);
  }

  @Get()
  findAll(@Query('sePractice') sePractice?: string) {
    if (sePractice) {
      return this.evidenceService.findBySEPractice(sePractice);
    }
    return this.evidenceService.findAll();
  }

  @Get('article/:articleId')
  findByArticle(@Param('articleId') articleId: string) {
    return this.evidenceService.findByArticle(articleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evidenceService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ANALYST, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateEvidenceDto: UpdateEvidenceDto,
    @Request() req,
  ) {
    return this.evidenceService.update(id, updateEvidenceDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.evidenceService.remove(id);
  }
}

