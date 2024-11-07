import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../user/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
  exports: [AuthService],
})
export class AuthModule {}
