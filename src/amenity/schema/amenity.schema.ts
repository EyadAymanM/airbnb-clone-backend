import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
class Name {
  @Prop({})
  en: string;
  @Prop({})
  ar: string;
}

class Description {
  @Prop({})
  en: string;
  @Prop({})
  ar: string;
}
@Schema()
export class Amenity extends Document {
  @Prop({ type: Name, required: true, unique: true })
  name: Name;

  @Prop({ type: Description, required: true })
  description: Description;

  @Prop({ required: true })
  icon: string; 
}

export const AmenitySchema = SchemaFactory.createForClass(Amenity);
