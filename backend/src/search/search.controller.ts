import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('articles')
  searchArticles(@Query('q') query: string) {
    return this.searchService.searchArticles(query);
  }

  @Get('se-practice')
  searchBySEPractice(@Query('practice') sePractice: string) {
    return this.searchService.searchBySEPractice(sePractice);
  }

  @Get('claim')
  searchByClaim(@Query('claim') claim: string) {
    return this.searchService.searchByClaim(claim);
  }

  @Get('advanced')
  searchAdvanced(
    @Query('q') query?: string,
    @Query('sePractice') sePractice?: string,
    @Query('claim') claim?: string,
    @Query('yearFrom') yearFrom?: number,
    @Query('yearTo') yearTo?: number,
    @Query('evidenceResult') evidenceResult?: string,
  ) {
    return this.searchService.searchAdvanced({
      query,
      sePractice,
      claim,
      yearFrom: yearFrom ? parseInt(yearFrom.toString()) : undefined,
      yearTo: yearTo ? parseInt(yearTo.toString()) : undefined,
      evidenceResult,
    });
  }
}

