import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ExerciseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, default: null })
  sets: string | null;

  @Prop({ type: String, default: null })
  reps: string | null;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const ExerciseSchemaDefinition = SchemaFactory.createForClass(ExerciseSchema);
