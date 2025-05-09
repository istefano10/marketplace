import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class RmqService {
  private readonly logger = new Logger(RmqService.name);

  constructor(@Inject('ORDER_RMQ_SERVICE') private readonly client: ClientProxy) {}

  emitOrderShipped(orderId: string) {
    this.logger.log(`Emitting order shipped message for orderId: ${orderId}`);
    
    this.client.emit('msg_order', { orderId })
      .pipe(
        catchError(error => {
          this.logger.error(`Failed to emit order shipped message for orderId: ${orderId}`, error.stack);
          return of(null);
        })
      )
      .subscribe({
        next: () => {
          this.logger.log(`Successfully emitted order shipped message for orderId: ${orderId}`);
        },
        error: (err) => {
          this.logger.error('Error in emitting the message', err.stack);
        },
      });
  }
}
