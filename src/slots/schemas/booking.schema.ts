import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'AvailabilitySlot', required: true, unique: true })
  slotId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.virtual('id').get(function () {
  return this._id?.toHexString();
});

BookingSchema.set('toJSON', {
  virtuals: true,
  transform: (
    _doc: unknown,
    ret: {
      _id?: { toString: () => string };
      __v?: number;
      slotId?: { toHexString: () => string };
      userId?: { toHexString: () => string };
    },
  ) => {
    const r = ret as Record<string, unknown>;
    r.id = ret._id?.toString();
    delete r._id;
    delete r.__v;
    if (ret.slotId?.toHexString) r.slotId = ret.slotId.toHexString();
    if (ret.userId?.toHexString) r.userId = ret.userId.toHexString();
    return r;
  },
});
