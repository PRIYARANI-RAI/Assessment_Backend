import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SlotsService } from './slots.service';
import { BookSlotDto } from './dto/book-slot.dto';
import { GetSlotsByDateQueryDto } from './dto/get-slots-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Slots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get('available')
  @ApiOperation({ summary: 'Get available slots by date' })
  @ApiQuery({ name: 'date', example: '2025-02-06', description: 'YYYY-MM-DD' })
  getAvailableByDate(@Query() query: GetSlotsByDateQueryDto) {
    return this.slotsService.getAvailableSlotsByDate(query.date);
  }

  @Post('book')
  @ApiOperation({ summary: 'Book a slot' })
  bookSlot(
    @CurrentUser('sub') userId: string,
    @Body() bookSlotDto: BookSlotDto,
  ) {
    return this.slotsService.bookSlot(userId, bookSlotDto.slotId);
  }

  @Get('my-bookings')
  @ApiOperation({ summary: 'Get my bookings' })
  getMyBookings(@CurrentUser('sub') userId: string) {
    return this.slotsService.getMyBookings(userId);
  }

  @Delete('bookings/:id')
  @ApiOperation({ summary: 'Cancel a booking' })
  cancelBooking(
    @Param('id') bookingId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.slotsService.cancelBooking(bookingId, userId);
  }
}
