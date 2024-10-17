import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Controller('wishlist')
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}
  @Get()
  async getWishlist(@Req() req) {
    const userId = req.id;
    return this.wishlistService.getWishlist(userId);
  }
  @Get('/:wishlistId')
  async getWishlistById(@Req() req, @Param('wishlistId') wishlistId: string) {
    const userId = req.id;
    return this.wishlistService.getWishlistById(userId, wishlistId);
  }
  @Post()
  async CreateWishlist(
    @Req() req,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    const userId = req.id;
    return this.wishlistService.createWishlist(userId, createWishlistDto);
  }

  @Delete('/:wishlistId')
  async deleteWishlist(@Req() req, @Param('wishlistId') wishlistId: string) {
    const userId = req.id;
    console.log(`Deleting wishlist ${wishlistId}`);
    try {
      return await this.wishlistService.deleteWishlist(userId, wishlistId);
    } catch (error) {
      throw new Error(
        `Failed to delete wishlist ${wishlistId}: ${error.message}`,
      );
    }
  }

  @Put('/add')
  async addToWishlist(
    @Req() req,
    @Body('wishlistId') wishlistId: string,
    @Body('listingId') listingId: string,
  ) {
    const userId = req.id;
    return this.wishlistService.addListingIdToWishlist(
      userId,
      wishlistId,
      listingId,
    );
  }

  @Delete('/remove')
  async removeFromWishlist(
    @Req() req,
    @Body('wishlistId') wishlistId: string,
    @Body('listingId') listingId: string,
  ) {
    const userId = req.id;
    return await this.wishlistService.removeFromWishlist(
      userId,
      wishlistId,
      listingId,
    );
  }
}
