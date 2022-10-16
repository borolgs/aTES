import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpLogInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();

    this.logger.log(`${req.method} ${req.url}`);
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse<FastifyReply>();
        this.logger.log(`${res.statusCode} ${req.url} ${Date.now() - now}ms`);
      }),
    );
  }
}
