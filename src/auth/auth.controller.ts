import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { Register } from './dto/register.dto';
import { LogIn } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}
  @Post('register')
  register(@Body() register: Register) {
    return this.authService.register(
      register.firstName,
      register.lastName,
      register.email,
      register.password,
    );
  }
  @Post('login')
  login(@Body() login: LogIn) {
    return this.authService.login(login.email, login.password);
  }
}
