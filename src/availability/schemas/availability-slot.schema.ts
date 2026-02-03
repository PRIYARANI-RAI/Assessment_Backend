import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AvailabilitySlotDocument = AvailabilitySlot & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class AvailabilitySlot {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ default: 'PT' })
  sessionName: string;

  @Prop({ default: false })
  repeatSessions: boolean;
}

export const AvailabilitySlotSchema = SchemaFactory.createForClass(AvailabilitySlot);

AvailabilitySlotSchema.virtual('id').get(function () {
  return this._id?.toHexString();
});

AvailabilitySlotSchema.set('toJSON', {
  virtuals: true,
  transform: (
    _doc: unknown,
    ret: { _id?: { toString: () => string }; __v?: number; userId?: { toHexString: () => string } },
  ) => {
    const r = ret as Record<string, unknown>;
    r.id = ret._id?.toString();
    delete r._id;
    delete r.__v;
    if (ret.userId?.toHexString) r.userId = ret.userId.toHexString();
    return r;
  },
});
