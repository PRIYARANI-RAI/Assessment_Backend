import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, Matches } from 'class-validator';

export class CreateAvailabilityDto {
  @ApiProperty({ example: '2024-07-24', description: 'Date (YYYY-MM-DD)' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' })
  date: string;

  @ApiProperty({ example: '11:30 AM', description: 'Start time' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '11:45 AM', description: 'End time' })
  @IsString()
  endTime: string;

  @ApiPropertyOptional({ example: 'PT', default: 'PT' })
  @IsOptional()
  @IsString()
  sessionName?: string;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  repeatSessions?: boolean;
}
