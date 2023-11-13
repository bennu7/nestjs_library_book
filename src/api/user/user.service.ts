import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private entityManager: EntityManager,
    private readonly jwtService: JwtService,
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

  async login(res: Response, loginUserDto: LoginUserDto) {
    const checkUser = await this.userRepository.findOne({
      where: {
        user_name: loginUserDto.user_name,
      },
    });

    if (!checkUser) {
      throw new HttpException(
        'User not found'.toUpperCase(),
        HttpStatus.NOT_FOUND,
      );
    }

    const checkPassword = await bcrypt.compare(
      loginUserDto.password,
      checkUser.password,
    );

    if (!checkPassword) {
      throw new HttpException('Password is wrong', HttpStatus.BAD_REQUEST);
    }

    // const token = generateJwt(checkUser.id, checkUser.role);
    const token = this.jwtService.sign(
      {
        id: checkUser.id,
        role: checkUser.role,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '24h',
      },
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return token;
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
