/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.model';
import { Error, Model } from 'mongoose';

@Injectable()
export class ReviewService {

  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      const createdReview = new this.reviewModel(createReviewDto);
      return await createdReview.save();
    } catch (error) {
      if (error instanceof Error.ValidationError) {
        throw new BadRequestException('Invalid review ');
      }
      throw new InternalServerErrorException('Error while createing review');
    }
  }

  
  async createUserReview(createReviewDto: CreateReviewDto, reviewerId): Promise<Review> {
    try {
      const createdReview = new this.reviewModel({ ...createReviewDto, reviewerId: reviewerId });
      return await createdReview.save();
    } catch (error) {
      if (error instanceof Error.ValidationError) {
        throw new BadRequestException('Invalid review');
      }
      throw new InternalServerErrorException('Error creating review');
    }
  }

  async findAll(): Promise<Review[]> {
    try {
      return await this.reviewModel.find();
    } catch (error) {
      throw new InternalServerErrorException('Error in find all reviews');
    }
  }

  async findOne(id: string): Promise<Review> {
    try {
      const review = await this.reviewModel.findById(id).populate('');
      if (!review) {
        throw new NotFoundException('not found review');
      }
      return review;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error in find review');
    }
  }


  async update(id: string, updateReviewDto: UpdateReviewDto,): Promise<Review> {

    try {
      const updatedReview = await this.reviewModel.findByIdAndUpdate(id, updateReviewDto,{ new: true, runValidators: true, });

      if (!updatedReview) {
        throw new NotFoundException('not found review');
      }
      return updatedReview;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error.ValidationError) {
        throw new BadRequestException('Invalid updated review');
      }
      throw new InternalServerErrorException('Error in updating review');
    }
  }

  async remove(id: string): Promise<Review> {
    try {
      const deletedReview = await this.reviewModel.findByIdAndDelete(id);
      if (!deletedReview) {
        throw new NotFoundException('not found review');
      }
      return deletedReview;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error in deleting review...');
    }
  }


}
