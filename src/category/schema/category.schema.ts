import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document } from 'mongoose';

class DisplayName {
  @Prop({})
  en: string;

  @Prop({})
  ar: string;
}
@Schema()
export class Category extends Document {
  @Prop({ type: DisplayName, required: true, unique: true })
  @Type(() => DisplayName)
  displayName: DisplayName;

  @Prop({ required: true })
  technicalName: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  show: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
