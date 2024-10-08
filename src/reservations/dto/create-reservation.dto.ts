import { IsDate, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  listingId: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

//   @IsNotEmpty()
//   @IsNumber()
//   totalPrice: number;
}
