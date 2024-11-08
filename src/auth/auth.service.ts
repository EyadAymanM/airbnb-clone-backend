import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private oauth2Client: OAuth2Client;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    roles: string,
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
        role: user.roles,
      }),
    };
  }

  async registerNormalUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    const user: User = await this.userService.create({
      firstName,
      lastName,
      email,
      password,
    });
    if (!user) throw new BadRequestException('Somthing went wrong...');
    return {
      access_token: await this.jwtService.signAsync({
        id: user._id,
        firstName: user.firstName,
        email: user.email,
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
        role: user.roles,
      }),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      roles: user.roles,
    };
  }
  async googleLogin(idToken: string) {
    console.log(
      'process.env.GOOGLE_CLIENT_ID , ',
      process.env.GOOGLE_CLIENT_ID,
    );
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const user = await this.userService.findOrCreate({
        idToken: payload.sub,
        email: payload.email,
        name: payload.name,
        image: payload.picture,
      });
      const accessToken = await this.jwtService.signAsync({
        id: user._id,
        firstName: user.name,
        email: user.email,
        role: user.roles,
      });

      return {
        firstName: user.name,
        email: user.email,
        image: user.image,
        access_token: accessToken,
      };
    } catch (error) {
      console.error('Error during Google login:', error.message);
      throw new UnauthorizedException('Google login failed');
    }
  }
}
