import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String, default: null })
  displayName: string | null;

  @Prop({ required: true, unique: true })
  googleId: string;

  @Prop({ type: String, default: null })
  picture: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function () {
  return this._id?.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc: unknown, ret: { _id?: { toString: () => string }; __v?: number }) => {
    const r = ret as Record<string, unknown>;
    r.id = ret._id?.toString();
    delete r._id;
    delete r.__v;
    return r;
  },
});
