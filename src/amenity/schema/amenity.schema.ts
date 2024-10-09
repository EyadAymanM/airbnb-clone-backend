import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Amenity extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  from: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  icon: string; 
}

export const AmenitySchema = SchemaFactory.createForClass(Amenity);
