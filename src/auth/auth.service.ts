import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/schema/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    roles: string
  ) {
    const user: User = await this.userService.create({
      firstName,
      lastName,
      email,
      password,
      roles,
    });
    if (!user) throw new BadRequestException('Somthing went wrong...');
    return {
      access_token: await this.jwtService.signAsync({
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.roles
      }),
    };
  }

  async login(email: string, password: string) {
    const user: User = await this.userService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Wrong email or password');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Wrong email or password');
    return {
      access_token: await this.jwtService.signAsync({
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.roles
      }),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      roles: user.roles
    };
  }
}
