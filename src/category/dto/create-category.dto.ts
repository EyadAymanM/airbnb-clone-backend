import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

class DisplayName {
  @IsString()
  en: string;

  @IsString()
  ar: string;
}
export class CreateCategoryDto {
  @ValidateNested()
  @Type(() => DisplayName)
  displayName: string;

  @IsNotEmpty()
  @IsString()
  technicalName: string;

  @IsNotEmpty()
  @IsString()
  icon: string;

  @IsNotEmpty()
  @IsBoolean()
  show: boolean;
}