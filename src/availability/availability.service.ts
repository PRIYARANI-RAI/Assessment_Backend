import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AvailabilitySlot,
  AvailabilitySlotDocument,
} from './schemas/availability-slot.schema';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectModel(AvailabilitySlot.name)
    private readonly slotModel: Model<AvailabilitySlotDocument>,
  ) {}

  async create(userId: string, dto: CreateAvailabilityDto): Promise<AvailabilitySlotDocument> {
    const slot = new this.slotModel({
      userId: new Types.ObjectId(userId),
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      sessionName: dto.sessionName ?? 'PT',
      repeatSessions: dto.repeatSessions ?? false,
    });
    return slot.save();
  }

  async findAll(userId: string): Promise<AvailabilitySlotDocument[]> {
    return this.slotModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ date: 1, startTime: 1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<AvailabilitySlotDocument> {
    const slot = await this.slotModel
      .findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (!slot) {
      throw new NotFoundException(`Availability slot with id ${id} not found`);
    }
    return slot;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateAvailabilityDto,
  ): Promise<AvailabilitySlotDocument> {
    const slot = await this.findOne(id, userId);
    if (dto.date !== undefined) slot.date = dto.date;
    if (dto.startTime !== undefined) slot.startTime = dto.startTime;
    if (dto.endTime !== undefined) slot.endTime = dto.endTime;
    if (dto.sessionName !== undefined) slot.sessionName = dto.sessionName;
    if (dto.repeatSessions !== undefined) slot.repeatSessions = dto.repeatSessions;
    await slot.save();
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.slotModel
      .deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Availability slot with id ${id} not found`);
    }
  }
}
