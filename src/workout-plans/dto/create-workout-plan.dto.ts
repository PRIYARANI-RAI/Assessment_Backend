import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateWorkoutDayDto } from './create-workout-day.dto';

export class CreateWorkoutPlanDto {
  @ApiProperty({ example: "Beginner's Workout - 3 days" })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'Notes or instructions for the plan' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [CreateWorkoutDayDto], description: 'Days with exercises' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkoutDayDto)
  days: CreateWorkoutDayDto[];
}
