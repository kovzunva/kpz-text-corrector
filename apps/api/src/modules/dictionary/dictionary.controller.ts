import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus, Headers, BadRequestException } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UserDictionaryRule } from '../../common/types/domain';

@Controller('v1/dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get()
  async getRules(@Headers('x-user-id') userId?: string): Promise<readonly UserDictionaryRule[]> {
    if (!userId) return [];
    return this.dictionaryService.getUserRules(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRule(
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateRuleDto,
  ): Promise<UserDictionaryRule> {
    if (!userId) {
      throw new BadRequestException('User ID is required to create a dictionary rule');
    }
    return this.dictionaryService.addRule(dto, userId);
  }

  @Delete(':id')
  async deleteRule(
    @Param('id') id: string,
    @Headers('x-user-id') userId?: string,
  ): Promise<{ success: boolean }> {
    if (!userId) {
      throw new BadRequestException('User ID is required to delete a dictionary rule');
    }
    return this.dictionaryService.deleteRule(id, userId);
  }
}
