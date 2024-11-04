import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('info')
  getUserInfo(@Req() req) {
    const id = req.id;
    return this.userService.getUserInfo(id);
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.userService.findUser(id);
  }

  @UseGuards(AuthGuard)
  @Patch('info')
  updateUserInfo(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const id = req.id;
    return this.userService.update(id, updateUserDto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch('')
  updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const id = req.id;
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
