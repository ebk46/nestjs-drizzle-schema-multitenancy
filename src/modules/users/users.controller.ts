import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import type { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(@Req() request: Request) {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
