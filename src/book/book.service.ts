import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private entityManager: EntityManager,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const checkTitle = await this.bookRepository.findOne({
      where: { title: createBookDto.title },
    });

    if (checkTitle) {
      throw new HttpException(
        'Book title already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const book = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(book);
  }

  async findAll() {
    return await this.bookRepository.find();
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findOne({
      where: {
        id,
      },
      relations: { cart_items: true },
    });

    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    if (!updateBookDto) {
      throw new HttpException('No data submitted', HttpStatus.BAD_REQUEST);
    }

    const checkBook = await this.bookRepository.findOne({
      where: { id },
    });
    if (!checkBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const checkTitleQuery = (await this.bookRepository.query(
      `SELECT * FROM book WHERE title = '${updateBookDto?.title}' AND id != '${id}' LIMIT 1`,
    )) as Array<Book>;
    if (checkTitleQuery.length > 0) {
      throw new HttpException(
        'Book title already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.bookRepository.update(id, updateBookDto);

    const updatedBook = await this.bookRepository.findOne({ where: { id } });
    return updatedBook;
  }

  async remove(id: string) {
    const checkBook = await this.bookRepository.findOne({
      where: { id },
    });

    if (!checkBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const book = await this.bookRepository.softDelete(id);

    return book;
  }
}
