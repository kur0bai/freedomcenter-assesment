import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const request = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl } = request;
    // return the required data
    return next.handle().pipe(
      tap(() => {
        const time = Date.now() - now;
        console.log(
          `[${method}] ${originalUrl} - Tiempo de respuesta: ${time}ms`,
        );
      }),
    );
  }
}
