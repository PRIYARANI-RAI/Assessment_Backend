import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class BookSlotDto {
  @ApiProperty({ description: 'Availability slot id to book' })
  @IsMongoId()
  slotId: string;
}
