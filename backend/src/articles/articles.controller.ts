import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ArticleStatus } from './schemas/article.schema';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUBMITTER, UserRole.MODERATOR, UserRole.ANALYST, UserRole.ADMIN)
  create(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    return this.articlesService.create(createArticleDto, req.user.userId);
  }

  @Get()
  findAll(@Query('status') status?: ArticleStatus) {
    return this.articlesService.findAll(status);
  }

  @Get('my-submissions')
  @UseGuards(JwtAuthGuard)
  findMySubmissions(@Request() req) {
    return this.articlesService.findBySubmitter(req.user.userId);
  }

  @Get('pending-review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  findPendingReview() {
    return this.articlesService.findPendingReview();
  }

  @Get('pending-analysis')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ANALYST, UserRole.ADMIN)
  findPendingAnalysis() {
    return this.articlesService.findPendingAnalysis();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUBMITTER, UserRole.MODERATOR, UserRole.ANALYST, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() req,
  ) {
    return this.articlesService.update(id, updateArticleDto, req.user.userId, req.user.roles);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  approve(@Param('id') id: string, @Request() req) {
    return this.articlesService.approve(id, req.user.userId);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  reject(@Param('id') id: string, @Body() body: { reason?: string }, @Request() req) {
    return this.articlesService.reject(id, req.user.userId, body.reason);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }

  @Post(':id/rate')
  @UseGuards(JwtAuthGuard)
  rate(
    @Param('id') id: string,
    @Body() body: { value: number },
    @Request() req,
  ) {
    return this.articlesService.rateArticle(id, req.user.userId, Number(body?.value));
  }
}

