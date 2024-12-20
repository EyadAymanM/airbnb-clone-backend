import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error } from 'mongoose';
import { Listing } from './schema/listing.model';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class ListingService {
  constructor(
    @InjectModel(Listing.name) private listingModel: Model<Listing>,
  ) {}

  async create(createListingDto: CreateListingDto): Promise<Listing> {
    try {
      const createdListing = new this.listingModel(createListingDto);
      return await createdListing.save();
    } catch (error) {
      if (error instanceof Error.ValidationError) {
        throw new BadRequestException('Invalid listing data');
      }
      throw new InternalServerErrorException('Error creating listing');
    }
  }

  async createUserListing(hostId): Promise<Listing> {
    try {
      const createdListing = new this.listingModel({ owner: hostId });
      return await createdListing.save();
    } catch (error) {
      if (error instanceof Error.ValidationError) {
        throw new BadRequestException('Invalid listing data');
      }
      throw new InternalServerErrorException('Error creating listing');
    }
  }

  async findAll(): Promise<Listing[]> {
    try {
      return await this.listingModel
        .find()
        .populate('category')
        .populate('amenities')
        .populate('owner', 'firstName lastName _id');
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving listings');
    }
  }

  async findVerified(): Promise<Listing[]> {
    try {
      return await this.listingModel.find({ verified: true, book: false });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving listings');
    }
  }

  async findOne(id: string): Promise<Listing> {
    try {
      const listing = await this.listingModel
        .findById(id)
        .populate('category')
        .populate('amenities')
        .populate('owner', 'firstName lastName _id')
        .exec();
      if (!listing) {
        throw new NotFoundException('Listing not found');
      }
      return listing;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving listing');
    }
  }

  async findByOwner(id: string): Promise<Listing[]> {
    try {
      const listings = await this.listingModel
        .find({ owner: id }, '_id createdAt')
        .exec();
      if (!listings) {
        throw new NotFoundException('Listing not found');
      }
      return listings;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving listings');
    }
  }

  async update(
    id: string,
    updateListingDto: UpdateListingDto,
  ): Promise<Listing> {
    try {
      const updatedListing = await this.listingModel.findByIdAndUpdate(
        id,
        updateListingDto,
        {
          new: true,
          runValidators: true,
        },
      );
      if (!updatedListing) {
        throw new NotFoundException('Listing not found');
      }
      return updatedListing;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error.ValidationError) {
        throw new BadRequestException('Invalid update data');
      }
      throw new InternalServerErrorException('Error updating listing');
    }
  }

  async remove(id: string): Promise<Listing> {
    try {
      const deletedListing = await this.listingModel.findByIdAndDelete(id);
      if (!deletedListing) {
        throw new NotFoundException('Listing not found');
      }
      return deletedListing;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting listing');
    }
  }

  async findByCategory(categoryName: string): Promise<Listing[]> {
    try {
      const listings = await this.listingModel.find({
        category: categoryName,
        verified: true,
        book: false
      });
      if (listings.length === 0) {
        throw new NotFoundException(
          `No listings found in category: ${categoryName}`,
        );
      }
      return listings;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error retrieving listings by category',
      );
    }
  }

  async searchByTitle(title: string): Promise<Listing[]> {
    try {
      const listings = await this.listingModel.find({
        verified: true,
        book: false
      });
      const result = listings.filter((listing) =>
        listing.title.toLowerCase().includes(title)
      );
      if (listings.length === 0) {
        throw new NotFoundException(`No listings found with this title`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving listings');
    }
  }

  async findByUserId(hostId: string): Promise<Listing[]> {
    try {
      const listings = await this.listingModel.find({
        owner: hostId,
      });

      if (!listings.length) {
        throw new NotFoundException(`No listings found for user ID: ${hostId}`);
      }

      return listings;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error retrieving listings by user ID',
      );
    }
  }
}
