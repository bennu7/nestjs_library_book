import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private entityManager: EntityManager,
  ) {}

  async create(res: Response, createUserDto: CreateUserDto) {
    const findEmailOrUsername = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { user_name: createUserDto.user_name },
      ],
    });

    if (findEmailOrUsername) {
      throw new HttpException(
        'Email or username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = bcrypt.hashSync(createUserDto.password, salt);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashPassword,
    });
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'user_name', 'email', 'role'],
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: { cart: true },
      select: ['id', 'user_name', 'email', 'role'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const checkUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!checkUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const checkDuplicatEmailOrUsername = await this.userRepository.findOne({
      where: [
        { email: updateUserDto.email },
        { user_name: updateUserDto.user_name },
      ],
    });

    if (checkDuplicatEmailOrUsername) {
      throw new HttpException(
        'Email or username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (updateUserDto.password) {
      const updatedPassword = await bcrypt.hash(updateUserDto.password, 10);

      await this.userRepository.update(id, {
        ...updateUserDto,
        password: updatedPassword,
      });

      const getDataWasUpdated = await this.userRepository.findOne({
        where: {
          id,
        },
      });

      return getDataWasUpdated;
    }

    await this.userRepository.update(id, {
      ...updateUserDto,
    });

    const getDataWasUpdated = await this.userRepository.findOne({
      where: {
        id,
      },
      select: ['id', 'user_name', 'email', 'role'],
    });

    return getDataWasUpdated;
  }

  async remove(id: string) {
    const checkUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!checkUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return await this.userRepository.delete(id);
  }
}
