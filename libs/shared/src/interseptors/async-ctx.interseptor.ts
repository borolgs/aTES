import { randomUUID } from 'crypto';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { AsyncContext } from '@nestjs-steroids/async-context';
import { Observable } from 'rxjs';

@Injectable()
export class AsyncCtxInterceptor implements NestInterceptor {
  constructor(private readonly ac: AsyncContext<string, any>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.ac.register();
    this.ac.set('traceId', randomUUID());
    return next.handle();
  }
}
