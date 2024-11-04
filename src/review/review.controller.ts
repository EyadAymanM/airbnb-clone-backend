/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Review } from './schema/review.model';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto): Promise<Review>  {
    return this.reviewService.create(createReviewDto);
  }

  @Post('add')
  @UseGuards(AuthGuard)
  createUserReview(@Body() createReviewDto: CreateReviewDto, @Req() req): Promise<Review>  {
    const id = req.id;
    return this.reviewService.createUserReview(createReviewDto,id);
  }

  @Get()
  findAll(): Promise<Review[]>  {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Review>  {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto): Promise<Review>  {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string){
    return this.reviewService.remove(id);
  }
}
