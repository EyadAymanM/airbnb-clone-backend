import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation, ReservationDocument } from './schema/reservation.schema';
import { Listing } from 'src/listing/schema/listing.model';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @InjectModel(Listing.name)
    private listModel: Model<Listing>,
  ) {}

  async create(CreateReservationDto: CreateReservationDto) {
    const { listingId } = CreateReservationDto;
    const start = new Date(CreateReservationDto.startDate);
    const end = new Date(CreateReservationDto.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    const existingReservation = await this.reservationModel.findOne({
      listingId: listingId,
      $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }],
    });
    if (existingReservation) {
      throw new BadRequestException(
        'The listing is already reserved for the selected dates.',
      );
    }
    const listing = await this.listModel.findById(listingId);
    if (!listing) {
      throw new BadRequestException('Listing not found.');
    }
    if (!listing.price || typeof listing.price !== 'number') {
      throw new BadRequestException('Listing price is not valid.');
    }
    const pricePerDay = listing.price;
    const dayCount = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24),
    );
    const totalPrice = dayCount * pricePerDay;
    console.log(totalPrice);
    if (isNaN(totalPrice) || totalPrice <= 0) {
      throw new BadRequestException(
        'Total price should be a valid positive number',
      );
    }

    const newReservation = new this.reservationModel({
      ...CreateReservationDto,
      startDate: start,
      endDate: end,
      totalPrice: totalPrice,
    });
    return newReservation.save();
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationModel.find().populate('listingId').exec();
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    return this.reservationModel.find({ userId }).exec();
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel
      .findById(id)
      .populate('listingId')
      .exec();
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    const { startDate, endDate } = updateReservationDto;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    const existingReservation = await this.reservationModel.findById(id);
    if (!existingReservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    const listingId = existingReservation.listingId;

    const conflictingReservation = await this.reservationModel.findOne({
      listingId: listingId,
      $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }],
    });

    if (conflictingReservation) {
      throw new BadRequestException(
        'The listing is already reserved for the selected dates.',
      );
    }

    const listing = await this.listModel.findById(listingId);
    if (!listing) {
      throw new BadRequestException('Listing not found.');
    }

    const pricePerDay = listing.price;
    const dayCount = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24),
    );
    const totalPrice = dayCount * pricePerDay;

    if (isNaN(totalPrice) || totalPrice <= 0) {
      throw new BadRequestException(
        'Total price should be a valid positive number',
      );
    }

    const updatedReservation = await this.reservationModel
      .findByIdAndUpdate(
        id,
        { ...updateReservationDto, listingId, totalPrice },
        { new: true },
      )
      .exec();
    if (!updatedReservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return updatedReservation;
  }

  async remove(id: string): Promise<Reservation> {
    const deletedReservation = await this.reservationModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedReservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return deletedReservation;
  }
}
