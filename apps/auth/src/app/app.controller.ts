import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/ready')
  ready(): string {
    return 'ready';
  }

  @Get('/health')
  health(): string {
    return 'health';
  }
}
