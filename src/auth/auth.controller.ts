import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LogIn } from './dto/login.dto';
import { Register } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}
  @Post('register')
  register(@Body() register: Register) {
    if (register.roles){
      return this.authService.register(
        register.firstName,
        register.lastName,
        register.email,
        register.password,
        register.roles
      );
    } else {
      return this.authService.registerNormalUser(
        register.firstName,
        register.lastName,
        register.email,
        register.password,
      );
    }
  }
  @Post('login')
  login(@Body() login: LogIn) {
    return this.authService.login(login.email, login.password);
  }
  @Post('google-login')
  async googleLogin(@Body() body: { idToken: string }) {
    return this.authService.googleLogin(body.idToken);
  }
}
