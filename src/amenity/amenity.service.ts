import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Amenity } from './schema/amenity.schema';
import { CreateAmenityDto } from './dto/create-amenity.dto';

@Injectable()
export class AmenityService {
  constructor(
    @InjectModel(Amenity.name) private amenityModel: Model<Amenity>,
  ) {}

  async create(createAmenityDto: CreateAmenityDto) {
    const existingAmenity = await this.amenityModel.findOne({
      name: createAmenityDto.name,
    });
    if (existingAmenity) {
      throw new BadRequestException('This amenity already exists.');
    }
    const amenity = new this.amenityModel(createAmenityDto);
    return amenity.save();
  }

  async findAll() {
    return this.amenityModel.find().exec();
  }

  async findOne(id: string) {
    const amenity = await this.amenityModel.findById(id).exec();
    if (!amenity) {
      throw new NotFoundException(`Amenity with ID ${id} not found`);
    }
    return amenity;
  }

  async update(id: string, updateAmenityDto: Partial<CreateAmenityDto>) {
    const amenity = await this.amenityModel
      .findByIdAndUpdate(id, updateAmenityDto, { new: true })
      .exec();
    if (!amenity) {
      throw new NotFoundException(`Amenity with ID ${id} not found`);
    }
    return amenity;
  }

  async remove(id: string) {
    const amenity = await this.amenityModel.findByIdAndDelete(id).exec();
    if (!amenity) {
      throw new NotFoundException(`Amenity with ID ${id} not found`);
    }
    return amenity;
  }
}
