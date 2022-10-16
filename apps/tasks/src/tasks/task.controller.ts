import { Controller } from '@nestjs/common';
import { Auth } from '@shared/oauth2';
import { TaskService } from './task.service';

@Controller()
@Auth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
}
