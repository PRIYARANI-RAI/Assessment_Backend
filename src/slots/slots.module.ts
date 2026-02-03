import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AvailabilitySlot,
  AvailabilitySlotSchema,
} from '../availability/schemas/availability-slot.schema';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AvailabilitySlot.name, schema: AvailabilitySlotSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
  exports: [SlotsService],
})
export class SlotsModule {}
