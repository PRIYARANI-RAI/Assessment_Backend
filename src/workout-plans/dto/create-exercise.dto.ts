import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExerciseDto {
  @ApiPropertyOptional({ example: 'Bench Press' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '8' })
  @IsOptional()
  @IsString()
  sets?: string;

  @ApiPropertyOptional({ example: '5-8', description: 'Reps or duration e.g. 30 secs' })
  @IsOptional()
  @IsString()
  reps?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
