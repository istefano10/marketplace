import { ClientProxy } from '@nestjs/microservices';
export declare class RmqService {
    private readonly client;
    constructor(client: ClientProxy);
    emitOrderShipped(orderId: string): void;
}
