import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LogIn {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
