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
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('/api/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto, @Res() res: Response) {
    const created = await this.bookService.create(createBookDto);

    return successResponse(
      res,
      'SUCCESS CREATED BOOK',
      HttpStatus.CREATED,
      created,
    );
  }

  @Get()
  async findAll(@Res() res: Response) {
    const findAll = await this.bookService.findAll();

    return successResponse(
      res,
      'SUCCESS GET ALL BOOKS',
      HttpStatus.OK,
      findAll,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const findOne = await this.bookService.findOne(id);

    return successResponse(res, 'SUCCESS GET BOOK', HttpStatus.OK, findOne);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @Res() res: Response,
  ) {
    const deleted = await this.bookService.update(id, updateBookDto);

    return successResponse(res, 'SUCCESS UPDATED BOOK', HttpStatus.OK, deleted);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const removed = await this.bookService.remove(id);

    return successResponse(res, 'SUCCESS DELETED BOOK', HttpStatus.OK, removed);
  }
}
