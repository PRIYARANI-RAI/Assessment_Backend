import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AvailabilitySlot,
  AvailabilitySlotSchema,
} from './schemas/availability-slot.schema';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AvailabilitySlot.name, schema: AvailabilitySlotSchema },
    ]),
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
