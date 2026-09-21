import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { GlobalStatistics } from '../../common/types/domain';

@Controller('v1/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getGlobalStats(): Promise<GlobalStatistics> {
    return this.statsService.getGlobalStats();
  }
}
