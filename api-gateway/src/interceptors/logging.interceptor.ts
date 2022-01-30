import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(`Antes...`);
    const antes = Date.now();

    return next
      .handle()
      .pipe(tap(() => console.log(`Depois... ${Date.now() - antes}ms`)));
  }
}
