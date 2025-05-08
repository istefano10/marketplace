import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(
    @Inject('ORDER_RMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  emitOrderShipped(orderId: string) {
    console.log(`Emitiendo el evento 'order.shipped' para el orderId: ${orderId}`);
    this.client.emit('order.shipped', { orderId }).subscribe({
      error: (err) => console.error('❌ Emit failed:', err),
    });
  }
}