import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types, Document } from 'mongoose';
import { Type } from 'class-transformer';

class Address {
  @Prop({  })
  country: string;

  @Prop({  })
  city: string;

  @Prop({  })
  street: string;

  @Prop({  })
  governorate: string;

  @Prop({  })
  postalCode: string;
}
class Location {
  @Prop({  })
  latitude: number;

  @Prop({  })
  longitude: number;
}

class AvailableDate {
  @Prop({  })
  start_date: Date;

  @Prop({  })
  end_date: Date;
}

@Schema({ timestamps: true })
export class Listing extends Document {
  @Prop({  })
  type: string;

  @Prop({
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Category',
    
  })
  category: string;
  // category: Types.ObjectId;

  @Prop({ type: Address,  })
  @Type(() => Address)
  address: Address;

  @Prop({ type: Location,  })
  @Type(() => Location)
  location: Location;

  @Prop({  min: 1 })
  guests: number;

  @Prop({  min: 1 })
  bedrooms: number;

  @Prop({  min: 1 })
  beds: number;

  @Prop({  min: 0 })
  bathrooms: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity' }] })
  amenities?: Types.ObjectId[];

  @Prop({ type: [String],  minlength: 1 })
  photos: string[];

  @Prop({  })
  title: string;

  @Prop({  })
  description: string;

  @Prop({ type: Number,  min: 0 })
  price: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User',  })
  owner: Types.ObjectId;

  @Prop({ type: [AvailableDate],  })
  @Type(() => AvailableDate)
  availableDates: AvailableDate[];
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
