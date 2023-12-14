import { Controller, Get, Post } from '@nestjs/common';

@Controller()
export class CatsController {
    @Get()
  findAll(): string {
    return 'This action returns all cats';
  }

  @Get()
  create() {
    return 'This action adds a new cat';
  }

  
}