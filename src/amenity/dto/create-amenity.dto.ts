import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
class NameDto {
  @IsNotEmpty()
  @IsString()
  en: string;

  @IsNotEmpty()
  @IsString()
  ar: string;
}

class DescriptionDto {
  @IsNotEmpty()
  @IsString()
  en: string;

  @IsNotEmpty()
  @IsString()
  ar: string;
}

export class CreateAmenityDto {
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @ValidateNested()
  @Type(() => DescriptionDto)
  description: DescriptionDto;

  @IsNotEmpty()
  icon: string; 
}
