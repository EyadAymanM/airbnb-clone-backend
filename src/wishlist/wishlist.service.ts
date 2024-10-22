import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist } from './schema/wishlist.schema';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<Wishlist>,
  ) {}

  async getWishlist(userId: string): Promise<Wishlist[]> {
    try {
      const wishlist = await this.wishlistModel
        .find({ user: new Types.ObjectId(userId) })
        .populate({
          path: 'listing',
          model: 'Listing',
        });
      return wishlist;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error retrieving wishlist for user with ID: ${userId}`,
      );
    }
  }

  async getWishlistById(userId: string, wishlistId: string): Promise<Wishlist> {
    try {
      const wishlist = await this.wishlistModel
        .findOne({ _id: wishlistId })
        .populate({
          path: 'listing',
          model: 'Listing',
          // select: '_id',
        });
      return wishlist;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error retrieving wishlist with ID: ${wishlistId} for user with ID: ${userId}`,
      );
    }
  }

  async createWishlist(
    userId: string,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const existingWishlist = await this.wishlistModel.findOne({
      title: createWishlistDto.title,
    });
    if (existingWishlist) {
      throw new BadRequestException('Wishlist with this title already exists');
    }
    const newWishlist = new this.wishlistModel({
      user: new Types.ObjectId(userId),
      title: createWishlistDto.title,
      listing: createWishlistDto.listings,
    });
    return newWishlist.save();
  }

  async deleteWishlist(userId: string, wishlistId: string): Promise<string> {
    await this.wishlistModel.deleteOne({
      user: new Types.ObjectId(userId),
      _id: new Types.ObjectId(wishlistId),
    });
    return `Wishlist ${wishlistId} deleted successfully`;
  }

  async addListingIdToWishlist(
    userId: string,
    wishlistId: string,
    listingId: string,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistModel.findOne({
      user: new Types.ObjectId(userId),
      _id: new Types.ObjectId(wishlistId),
    });
    if (!wishlist.listing.includes(new Types.ObjectId(listingId))) {
      wishlist.listing.push(new Types.ObjectId(listingId));
    } else {
      throw new ConflictException('Listing already exists in the wishlist');
    }
    return wishlist.save();
  }

  async getAllListingIds(userId: string) {
    const wishlists = await this.wishlistModel.find({
      user: new Types.ObjectId(userId),
    });
    const listingIds = wishlists.flatMap((wishlist) => wishlist.listing);
    return listingIds;
  }

  async removeFromWishlist(
    userId: string,
    listingId: string,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistModel.findOne({
      user: new Types.ObjectId(userId),
    });
    wishlist.listing = wishlist.listing.filter((id) => {
      return id instanceof Types.ObjectId
        ? !id.equals(new Types.ObjectId(listingId))
        : id !== listingId;
    });
    return await wishlist.save();
  }
}
