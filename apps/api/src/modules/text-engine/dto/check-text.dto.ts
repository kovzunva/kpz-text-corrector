import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CheckTextDto {
  @IsString()
  @IsNotEmpty()
  readonly text!: string;

  @IsString()
  @IsOptional()
  readonly language?: string = 'uk';

  @IsInt()
  @Min(0)
  @IsOptional()
  readonly pageIndex?: number = 0;

  @IsInt()
  @Min(500)
  @IsOptional()
  readonly pageSize?: number = 2500;
}
