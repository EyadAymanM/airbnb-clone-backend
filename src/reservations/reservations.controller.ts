import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('book')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createReservationDto: CreateReservationDto, @Req() req) {
    const id = req.id;
    return this.reservationsService.create(createReservationDto, id);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.reservationsService.findByUser(userId);
    }
    return this.reservationsService.findAll();
  }

  @Get('user')
  @UseGuards(AuthGuard)
  findByUser(@Req() req) {
    const userId = req.id;
    return this.reservationsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Get('monthly-data')
  async getMonthlyBookingsAndRevenue(@Query('year') year: string) {
    const targetYear = parseInt(year) || new Date().getFullYear();
    return this.reservationsService.getMonthlyBookingsAndRevenue(targetYear);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
