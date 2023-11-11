import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

import { successResponse } from '@/utils/api-response.util';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('/api')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get('/cart')
  async findAllCart(@Res() res: Response) {
    const getDataCart = await this.cartService.findAllCart();

    return successResponse(
      res,
      'Success get all data cart',
      HttpStatus.OK,
      getDataCart,
    );
  }

  @Get('/cart-item')
  async findAllCartItem(@Res() res: Response) {
    const getCartItems = await this.cartService.findAllCartItem();

    return successResponse(
      res,
      'Success get all data cart item',
      HttpStatus.OK,
      getCartItems,
    );
  }

  @Get('/cart/:id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOneCart(id);
  }

  @Patch('/cart/:id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCart(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
