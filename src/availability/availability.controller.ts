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
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Availability')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @ApiOperation({ summary: 'Set availability slot' })
  create(
    @CurrentUser('sub') userId: string,
    @Body() createAvailabilityDto: CreateAvailabilityDto,
  ) {
    return this.availabilityService.create(userId, createAvailabilityDto);
  }

  @Get()
  @ApiOperation({ summary: 'List my availability slots' })
  findAll(@CurrentUser('sub') userId: string) {
    return this.availabilityService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get availability slot by id' })
  findOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.availabilityService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update availability slot' })
  update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    return this.availabilityService.update(id, userId, updateAvailabilityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete availability slot' })
  remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.availabilityService.remove(id, userId);
  }
}
