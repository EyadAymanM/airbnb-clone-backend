import { IsString, IsArray, IsMongoId, MaxLength } from 'class-validator';
import { Types } from 'mongoose';

export class CreateWishlistDto {
  @IsString()
  @MaxLength(50)
  title: string;

  @IsArray()
  @IsMongoId({ each: true })
  listings: Types.ObjectId[];
}
