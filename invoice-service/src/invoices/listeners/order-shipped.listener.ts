// src/invoice/listeners/order-shipped.listener.ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InvoiceService } from '../invoice.service';

interface OrderShippedPayload {
  orderId: string;
}

@Controller()
export class OrderShippedListener {
  constructor(private readonly invoiceService: InvoiceService) {}

  // Event pattern to listen for 'order.shipped' event
  @EventPattern('order.shipped')
  async handleOrderShipped(@Payload() data: any): Promise<void> {
    try {
      console.log(1111111111111111111111111111)
      const payload: OrderShippedPayload = data;
      console.log(`Received orderId: ${payload.orderId}`);
      await this.invoiceService.sendInvoice(payload.orderId);
    } catch (error) {
      console.error('Error handling order shipment event', error);
    }
  }
}
