/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  reviewerId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true })
  listingId: mongoose.Schema.Types.ObjectId; 

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true })
  reservationsId: mongoose.Schema.Types.ObjectId; 

  @Prop({ required: true })
  rating: number; 

  @Prop({minlength: 10, maxlength: 500 })
  comment: string; 

//   @Prop({ default: Date.now })
//   reviewDate?: Date; 

}

export const ReviewSchema = SchemaFactory.createForClass(Review);
