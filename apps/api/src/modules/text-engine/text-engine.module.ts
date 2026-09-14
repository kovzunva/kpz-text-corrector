import { Module } from '@nestjs/common';
import { TextEngineService } from './text-engine.service';
import { TextEngineController } from './text-engine.controller';
import { LanguageToolService } from './services/languagetool.service';
import { HeuristicsService } from './services/heuristics.service';
import { PaginationService } from './services/pagination.service';

@Module({
  controllers: [TextEngineController],
  providers: [
    TextEngineService,
    LanguageToolService,
    HeuristicsService,
    PaginationService,
  ],
  exports: [TextEngineService],
})
export class TextEngineModule {}
