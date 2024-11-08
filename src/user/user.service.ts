import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Error, Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const user: User = await this.userModel.create(createUserDto);
    return user;
  }

  async findAll() {
    try {
      const users: User[] = await this.userModel.find();
      if (!users) throw new NotFoundException();
      return users;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findUser(id: string) {
    try {
      const user: User = await this.userModel.findById(id);
      if (!user) throw new NotFoundException();
      return user;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
  async findUserByEmail(email: string) {
    const user: User = await this.userModel.findOne({ email });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        {
          new: true,
          runValidators: true,
        },
      );
      if (!updatedUser) {
        throw new NotFoundException('Listing not found');
      }
      return updatedUser;
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

  async getUserInfo(id: string) {
    try {
      const user: User = await this.userModel.findById(id);
      if (!user) throw new NotFoundException();
      return user;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user: User = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        { new: true },
      );
      if (!user) throw new NotFoundException();
      return user;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      const user: User = await this.userModel.findByIdAndDelete(id);
      if (!user) throw new NotFoundException();
      return user;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
  async findOrCreate(userData: {
    idToken: string;
    email: string;
    name: string;
    image: string;
  }) {
    try {
      let user = await this.userModel.findOne({ email: userData.email });
      if (!user) {
        user = await this.userModel.create({
          idToken: userData.idToken,
          email: userData.email,
          name: userData.name,
          image: userData.image,
        });
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error handling Google login');
    }
  }
}
