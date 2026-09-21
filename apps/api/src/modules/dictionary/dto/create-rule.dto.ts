import { IsString, IsOptional } from 'class-validator';

export class CreateRuleDto {
  @IsString()
  @IsOptional()
  readonly wordPattern?: string;

  @IsString()
  @IsOptional()
  readonly ruleId?: string;
}
