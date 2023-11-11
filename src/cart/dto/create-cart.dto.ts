import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsInt,
  Min,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class CartItem {
  @IsUUID()
  @IsNotEmpty()
  cart_id: string;

  @IsString()
  @IsNotEmpty()
  book_id: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateCartDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsArray({ always: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CartItem)
  cart_items: CartItem[];
}
