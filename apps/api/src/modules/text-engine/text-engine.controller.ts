import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TextEngineService } from './text-engine.service';
import { CheckTextDto } from './dto/check-text.dto';
import { CheckTextResponse } from '../../common/types/domain';

@Controller('v1/text')
export class TextEngineController {
  constructor(private readonly textEngine: TextEngineService) {}

  @Post('check-guest')
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
