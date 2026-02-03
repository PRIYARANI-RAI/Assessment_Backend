import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkoutPlansService } from './workout-plans.service';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Workout Plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workout-plans')
export class WorkoutPlansController {
  constructor(private readonly workoutPlansService: WorkoutPlansService) {}

  @Post()
  @ApiOperation({ summary: 'Add custom workout plan' })
  create(
    @CurrentUser('sub') userId: string,
    @Body() createWorkoutPlanDto: CreateWorkoutPlanDto,
  ) {
    return this.workoutPlansService.create(userId, createWorkoutPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all custom workout plans' })
  findAll(@CurrentUser('sub') userId: string) {
    return this.workoutPlansService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workout plan by id' })
  findOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.workoutPlansService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update workout plan' })
  update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() updateWorkoutPlanDto: UpdateWorkoutPlanDto,
  ) {
    return this.workoutPlansService.update(id, userId, updateWorkoutPlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workout plan' })
  remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.workoutPlansService.remove(id, userId);
  }
}
