import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
    new(...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) { }

    intercept(contenxt: ExecutionContext, handler: CallHandler): Observable<any> {
        // Run something before a request is handled
        // by the request handler

        return handler.handle().pipe(
            map((data: any) => {
                // Run something before the response is sent out
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                });
            })
        )
    }
}