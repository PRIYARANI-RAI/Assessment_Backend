import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WorkoutPlan, WorkoutPlanDocument } from './schemas/workout-plan.schema';
import { WorkoutDaySchema } from './schemas/workout-day.schema';
import { ExerciseSchema } from './schemas/exercise.schema';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';

@Injectable()
export class WorkoutPlansService {
  constructor(
    @InjectModel(WorkoutPlan.name)
    private readonly planModel: Model<WorkoutPlanDocument>,
  ) {}

  async create(userId: string, dto: CreateWorkoutPlanDto): Promise<WorkoutPlanDocument> {
    const days: WorkoutDaySchema[] = dto.days.map((dayDto, i) => ({
      name: dayDto.name,
      sortOrder: dayDto.sortOrder ?? i,
      exercises: dayDto.exercises.map((ex, j) => ({
        name: ex.name,
        sets: ex.sets ?? null,
        reps: ex.reps ?? null,
        sortOrder: ex.sortOrder ?? j,
      })),
    }));
    const plan = new this.planModel({
      userId: new Types.ObjectId(userId),
      title: dto.title,
      notes: dto.notes ?? null,
      days,
    });
    const saved = await plan.save();
    return this.findOne(saved._id.toHexString(), userId);
  }

  async findAll(userId: string): Promise<WorkoutPlanDocument[]> {
    return this.planModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<WorkoutPlanDocument> {
    const plan = await this.planModel
      .findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (!plan) {
      throw new NotFoundException(`Workout plan with id ${id} not found`);
    }
    return plan;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateWorkoutPlanDto,
  ): Promise<WorkoutPlanDocument> {
    const plan = await this.findOne(id, userId);
    if (dto.title !== undefined) plan.title = dto.title;
    if (dto.notes !== undefined) plan.notes = dto.notes;
    if (dto.days) {
      plan.days = dto.days.map((dayDto, i) => ({
        name: dayDto.name,
        sortOrder: dayDto.sortOrder ?? i,
        exercises: dayDto.exercises.map((ex, j) => ({
          name: ex.name,
          sets: ex.sets ?? null,
          reps: ex.reps ?? null,
          sortOrder: ex.sortOrder ?? j,
        })),
      }));
    }
    await plan.save();
    return this.findOne(plan._id.toHexString(), userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.planModel
      .deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Workout plan with id ${id} not found`);
    }
  }
}
