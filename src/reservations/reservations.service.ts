import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
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

  private async checkForConflictingReservations(
    listingId: string,
    start: Date,
    end: Date,
  ) {
    const existingReservation = await this.reservationModel.findOne({
      listingId: listingId,
      $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }],
    });
    if (existingReservation) {
      throw new BadRequestException(
        'The listing is already reserved for the selected dates.',
      );
    }
  }

  async create(CreateReservationDto: CreateReservationDto) {
    const { listingId } = CreateReservationDto;
    const start = new Date(CreateReservationDto.startDate);
    const end = new Date(CreateReservationDto.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    await this.checkForConflictingReservations(listingId, start, end);

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
    return this.reservationModel
      .find()
      .populate('listingId', 'title price _id')
      .populate('userId', 'firstName lastName _id')
      .exec();
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

  // async update(id: string, updateReservationDto: UpdateReservationDto) {
  //   const { startDate, endDate } = updateReservationDto;

  //   if (!startDate || !endDate) {
  //     throw new BadRequestException('startDate and endDate are required');
  //   }
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);

  //   if (isNaN(start.getTime()) || isNaN(end.getTime())) {
  //     throw new BadRequestException('Invalid date format');
  //   }

  //   const existingReservation = await this.reservationModel.findById(id);
  //   if (!existingReservation) {
  //     throw new NotFoundException(`Reservation with ID ${id} not found`);
  //   }

  //   const listingId = existingReservation.listingId.toString(); // تحويل ObjectId إلى string

  //   await this.checkForConflictingReservations(listingId, start, end);

  //   const listing = await this.listModel.findById(listingId);
  //   if (!listing) {
  //     throw new BadRequestException('Listing not found.');
  //   }

  //   const pricePerDay = listing.price;
  //   const dayCount = Math.ceil(
  //     (end.getTime() - start.getTime()) / (1000 * 3600 * 24),
  //   );
  //   const totalPrice = dayCount * pricePerDay;

  //   if (isNaN(totalPrice) || totalPrice <= 0) {
  //     throw new BadRequestException(
  //       'Total price should be a valid positive number',
  //     );
  //   }

  //   const updatedReservation = await this.reservationModel
  //     .findByIdAndUpdate(
  //       id,
  //       { ...updateReservationDto, listingId, totalPrice },
  //       { new: true },
  //     )
  //     .exec();
  //   if (!updatedReservation) {
  //     throw new NotFoundException(`Reservation with ID ${id} not found`);
  //   }
  //   return updatedReservation;
  // }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    const existingReservation = await this.reservationModel.findById(id);
    if (!existingReservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    // استخدام التواريخ الموجودة إذا لم يتم تقديمها في الطلب
    const startDate =
      updateReservationDto.startDate || existingReservation.startDate;
    const endDate = updateReservationDto.endDate || existingReservation.endDate;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // التحقق من صحة التواريخ
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    // تحقق من التعارضات فقط إذا كانت التواريخ قد تغيرت
    if (
      existingReservation.startDate !== startDate ||
      existingReservation.endDate !== endDate
    ) {
      const listingId = existingReservation.listingId.toString();
      await this.checkForConflictingReservations(listingId, start, end);
    }

    const listingId = existingReservation.listingId.toString();
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
        {
          ...updateReservationDto,
          listingId,
          totalPrice,
          startDate: start,
          endDate: end,
        },
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
