import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WorkoutDaySchema, WorkoutDaySchemaDefinition } from './workout-day.schema';

export type WorkoutPlanDocument = WorkoutPlan & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class WorkoutPlan {
  @Prop({ required: true })
  title: string;

  @Prop({ type: String, default: null })
  notes: string | null;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [WorkoutDaySchemaDefinition], default: [] })
  days: WorkoutDaySchema[];
}

export const WorkoutPlanSchema = SchemaFactory.createForClass(WorkoutPlan);

WorkoutPlanSchema.virtual('id').get(function () {
  return this._id?.toHexString();
});

WorkoutPlanSchema.set('toJSON', {
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
