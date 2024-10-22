import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Wishlist extends Document {
  @Prop({ type: String, required: true, unique: true, index: true })
  title: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Listing' }],
    required: true,
    default: [],
  })
  listing: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
