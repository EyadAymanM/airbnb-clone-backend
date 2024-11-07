import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Amenity extends Document {
  @Prop({
    type: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    required: true,
    unique: true,
  })
  name: {
    en: string;
    ar: string;
  };

  @Prop({
    type: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    required: true,
  })
  description: {
    en: string;
    ar: string;
  };

  @Prop({ required: true })
  icon: string;
}

export const AmenitySchema = SchemaFactory.createForClass(Amenity);
