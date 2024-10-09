/* eslint-disable prettier/prettier */

import { IsMongoId, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";


export class CreateReviewDto {

    @IsMongoId()
    reviewerId: Types.ObjectId;

    @IsMongoId()
    listingId: Types.ObjectId;

    @IsMongoId()
    reservationsId: Types.ObjectId;

    @IsNumber()
    rating: number;

    @IsString()
    @MinLength(10)
    @MaxLength(500)
    comment?: string;

    // @IsDate()
    // reviewDate?: Date

}
