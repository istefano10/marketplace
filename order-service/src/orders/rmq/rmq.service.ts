import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(
    @Inject('ORDER_RMQ_SERVICE') private readonly client: ClientProxy,  // Inyección del cliente de RabbitMQ
  ) {}

  emitOrderShipped(orderId: string) {
    this.client.emit('order.shipped', { orderId }).subscribe({
      error: (err) => console.error('❌ Emit failed:', err),
    });
  }
}
