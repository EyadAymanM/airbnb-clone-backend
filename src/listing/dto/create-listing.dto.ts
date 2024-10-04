import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  ValidateNested,
  Min,
  ArrayMinSize,
  IsDate,
  IsOptional,
  IsMongoId,
  IsArray,
} from 'class-validator';
import { Types } from 'mongoose';

class AddressDto {
  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  street: string;

  @IsString()
  governorate: string;

  @IsString()
  postalCode: string;
}

class LocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

class AvailableDateDto {
  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @IsDate()
  @Type(() => Date)
  end_date: Date;
}

export class CreateListingDto {
  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsNumber()
  @Min(1)
  guests: number;

  @IsNumber()
  @Min(1)
  bedrooms: number;

  @IsNumber()
  @Min(1)
  beds: number;

  @IsNumber()
  @Min(0)
  bathrooms: number;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  amenities?: Types.ObjectId[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(5)
  photos?: string[];

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsMongoId()
  owner: Types.ObjectId;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailableDateDto)
  availableDates: AvailableDateDto[];

  @IsString()
  // @IsMongoId()
  category?: string;
  // category?: Types.ObjectId;
}
