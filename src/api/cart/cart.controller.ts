import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthGuard } from 'src/guard/auth/auth.guard';
import { Roles } from 'src/utils/roles.decorator';
import { successResponse } from 'src/utils/api-response.util';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('/api')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get('/cart')
  @Roles('admin')
  @UseGuards(AuthGuard)
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
  @Roles('admin', 'user')
  @UseGuards(AuthGuard)
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
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const findCart = await this.cartService.findOneCart(id);

    return successResponse(
      res,
      'Success get data cart',
      HttpStatus.OK,
      findCart,
    );
  }

  @Patch('/cart/:id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCart(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
