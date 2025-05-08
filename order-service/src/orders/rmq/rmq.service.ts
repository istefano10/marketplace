import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(@Inject('ORDER_RMQ_SERVICE') private readonly client: ClientProxy) {}

  emitOrderShipped(payload: string) {
    this.client.emit('msg_order', { texto: payload });
  }
}
