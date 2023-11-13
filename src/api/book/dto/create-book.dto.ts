import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  ISBN: string;

  @IsNumber()
  @IsNotEmpty()
  available_quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
