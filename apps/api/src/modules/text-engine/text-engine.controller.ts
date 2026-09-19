import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { TextEngineService } from './text-engine.service';
import { CheckTextDto } from './dto/check-text.dto';
import { CheckTextResponse } from '../../common/types/domain';

@Controller('v1/text')
@UseGuards(ThrottlerGuard)
export class TextEngineController {
  constructor(private readonly textEngine: TextEngineService) {}

  @Post('check-guest')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  async checkGuestText(@Body() dto: CheckTextDto): Promise<CheckTextResponse> {
    return this.textEngine.processText(dto, true);
  }

  @Post('check')
  @HttpCode(HttpStatus.OK)
  async checkUserText(@Body() dto: CheckTextDto): Promise<CheckTextResponse> {
    return this.textEngine.processText(dto, false);
  }
}
