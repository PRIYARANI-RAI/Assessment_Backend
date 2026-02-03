import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ExerciseSchema, ExerciseSchemaDefinition } from './exercise.schema';

@Schema({ _id: false })
export class WorkoutDaySchema {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ type: [ExerciseSchemaDefinition], default: [] })
  exercises: ExerciseSchema[];
}

export const WorkoutDaySchemaDefinition = SchemaFactory.createForClass(WorkoutDaySchema);
