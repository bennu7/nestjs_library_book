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

import { successResponse } from '@/utils/api-response.util';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const created = await this.userService.create(res, createUserDto);

    return successResponse(res, 'SUCCESS CREATED USER', 201, created);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const users = await this.userService.findAll();

    return successResponse(res, 'SUCCESS GET ALL USERS', 200, users);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.findOne(id);

    return successResponse(res, 'SUCCESS GET USER', 200, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const updated = await this.userService.update(id, updateUserDto);

    return successResponse(res, 'SUCCESS UPDATED USER', 200, updated);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const removed = await this.userService.remove(id);

    return successResponse(res, 'SUCCESS DELETED USER', 200, removed);
  }
}
