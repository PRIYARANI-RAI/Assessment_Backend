import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AvailabilitySlotDocument } from '../availability/schemas/availability-slot.schema';
import { Booking, BookingDocument } from './schemas/booking.schema';

export interface SlotWithStatus {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionName: string;
  status: 'open' | 'booked';
  bookingId?: string;
}

@Injectable()
export class SlotsService {
  constructor(
    @InjectModel('AvailabilitySlot')
    private readonly slotModel: Model<AvailabilitySlotDocument>,
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
  ) {}

  async getAvailableSlotsByDate(date: string): Promise<SlotWithStatus[]> {
    const slots = await this.slotModel
      .find({ date })
      .sort({ startTime: 1 })
      .exec();
    const bookings = await this.bookingModel
      .find({ slotId: { $in: slots.map((s) => s._id) } })
      .exec();
    const bookedSlotIds = new Set(bookings.map((b) => b.slotId.toString()));

    return slots.map((slot) => ({
      id: slot.id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      sessionName: slot.sessionName,
      status: bookedSlotIds.has(slot._id.toString()) ? 'booked' : 'open',
      bookingId: bookings.find((b) => b.slotId.toString() === slot._id.toString())?.id,
    }));
  }

  async bookSlot(userId: string, slotId: string): Promise<BookingDocument> {
    const slot = await this.slotModel.findById(slotId).exec();
    if (!slot) {
      throw new NotFoundException(`Slot with id ${slotId} not found`);
    }
    const existing = await this.bookingModel.findOne({ slotId: new Types.ObjectId(slotId) }).exec();
    if (existing) {
      throw new BadRequestException('Slot is already booked');
    }
    const booking = new this.bookingModel({
      slotId: new Types.ObjectId(slotId),
      userId: new Types.ObjectId(userId),
    });
    return booking.save();
  }

  async cancelBooking(bookingId: string, userId: string): Promise<void> {
    const result = await this.bookingModel
      .deleteOne({ _id: new Types.ObjectId(bookingId), userId: new Types.ObjectId(userId) })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }
  }

  async getMyBookings(userId: string): Promise<BookingDocument[]> {
    return this.bookingModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('slotId')
      .sort({ createdAt: -1 })
      .exec();
  }
}
