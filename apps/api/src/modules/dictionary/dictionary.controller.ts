import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UserDictionaryRule } from '../../common/types/domain';

@Controller('v1/dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get()
  async getRules(): Promise<readonly UserDictionaryRule[]> {
    return this.dictionaryService.getUserRules();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRule(@Body() dto: CreateRuleDto): Promise<UserDictionaryRule> {
    return this.dictionaryService.addRule(dto);
  }

  @Delete(':id')
  async deleteRule(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.dictionaryService.deleteRule(id);
  }
}
