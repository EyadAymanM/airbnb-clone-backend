import { IsNotEmpty } from 'class-validator';

export class CreateAmenityDto {
  @IsNotEmpty()
  name: {
    en: string;
    ar: string;
  };

  @IsNotEmpty()
  description: {
    en: string;
    ar: string;
  };

  @IsNotEmpty()
  icon: string;
}
