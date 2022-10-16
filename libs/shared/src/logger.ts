import { AsyncContext } from '@nestjs-steroids/async-context';
import { ConsoleLogger, LoggerService } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger implements LoggerService {
  constructor(
    private readonly appName: string,
    private readonly ac: AsyncContext<string, any>,
  ) {
    super();
  }

  protected formatPid(pid: number): string {
    return `[${this.appName}] ${pid}  - `;
  }

  debug(message: any, context: any) {
    super.debug(this.addTraceIdToMessage(message), context);
  }

  log(message: any, context: any) {
    super.log(this.addTraceIdToMessage(message), context);
  }
  error(message: any, context: any) {
    super.error(this.addTraceIdToMessage(message), context);
  }
  warn(message: any, context: any) {
    super.warn(this.addTraceIdToMessage(message), context);
  }
  verbose(message: any, context: any) {
    super.verbose(this.addTraceIdToMessage(message), context);
  }

  private addTraceIdToMessage(message: any) {
    // const traceId = this.ac.als.getStore()?.get('traceId') ?? '-';
    // const msg = `${traceId} ${message}`;
    return message;
  }
}
