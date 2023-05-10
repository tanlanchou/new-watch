import { Controller, Get } from '@nestjs/common';
import { SocialService } from '../service/social.service';

@Controller()
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Get()
  getHello(): string {
    return '';
  }
}
