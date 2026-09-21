import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UserDictionaryRule } from '../../common/types/domain';

@Injectable()
export class DictionaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserRules(userId: string = 'default-user'): Promise<readonly UserDictionaryRule[]> {
    const rules = await this.prisma.dictionaryRule.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return rules.map((r) => ({
      id: r.id,
      userId: r.userId,
      wordPattern: r.wordPattern,
      ruleId: r.ruleId || undefined,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async addRule(dto: CreateRuleDto, userId: string = 'default-user'): Promise<UserDictionaryRule> {
    const created = await this.prisma.dictionaryRule.create({
      data: {
        userId,
        wordPattern: dto.wordPattern || '',
        ruleId: dto.ruleId || null,
      },
    });

    return {
      id: created.id,
      userId: created.userId,
      wordPattern: created.wordPattern,
      ruleId: created.ruleId || undefined,
      createdAt: created.createdAt.toISOString(),
    };
  }

  async deleteRule(id: string, userId: string = 'default-user'): Promise<{ success: boolean }> {
    const rule = await this.prisma.dictionaryRule.findFirst({
      where: { id, userId },
    });

    if (!rule) {
      throw new NotFoundException(`Dictionary rule with ID "${id}" not found`);
    }

    await this.prisma.dictionaryRule.delete({
      where: { id },
    });

    return { success: true };
  }
}
