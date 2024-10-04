import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types, Document } from 'mongoose';
import { Type } from 'class-transformer';

class Address {
  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  governorate: string;

  @Prop({ required: true })
  postalCode: string;
}

class Location {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}

class AvailableDate {
  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;
}

@Schema({ timestamps: true })
export class Listing extends Document {
  @Prop({ required: true })
  type: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Types.ObjectId;

  @Prop({ type: Address, required: true })
  @Type(() => Address)
  address: Address;

  @Prop({ type: Location, required: true })
  @Type(() => Location)
  location: Location;

  @Prop({ required: true, min: 1 })
  guests: number;

  @Prop({ required: true, min: 1 })
  bedrooms: number;

  @Prop({ required: true, min: 1 })
  beds: number;

  @Prop({ required: true, min: 0 })
  bathrooms: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity' }] })
  amenities?: Types.ObjectId[];

  @Prop({ type: [String], required: true, minlength: 1 })
  photos: string[];

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ type: [AvailableDate], required: true })
  @Type(() => AvailableDate)
  availableDates: AvailableDate[];
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
