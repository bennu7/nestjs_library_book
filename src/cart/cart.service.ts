import { Injectable } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,

    private entityManager: EntityManager,
  ) {}

  async create(createCartDto: CreateCartDto) {
    const newCart = await this.cartRepository.create(createCartDto);

    await this.cartRepository.save(newCart);

    return newCart;
  }

  async findAllCart() {
    const carts = await this.cartRepository.find();

    return carts;
  }

  async findAllCartItem() {
    const cartItems = await this.cartItemRepository.find();

    return cartItems;
  }

  async findOneCart(id: string) {
    const findCart = await this.cartRepository.findOne({
      where: { id },
      relations: { cart_items: true },
    });

    if (!findCart) {
      throw new HttpException('Cart not found', 404);
    }

    return findCart;
  }

  async updateCart(id: string, updateCartDto: UpdateCartDto) {
    const checkIdCart = await this.cartRepository.findOne({
      where: { id },
    });

    if (!checkIdCart) {
      throw new HttpException('Cart not found', 404);
    }

    const updateCart = await this.cartRepository.update(id, updateCartDto);

    return updateCart;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
