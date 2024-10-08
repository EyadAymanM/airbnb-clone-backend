import { IsNotEmpty } from 'class-validator';

export class CreateAmenityDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  icon: string; 
}
