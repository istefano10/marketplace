import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InvoiceService } from '../invoice.service';

interface OrderShippedPayload {
  orderId: string;
}

@Controller()
export class OrderShippedListener {
  constructor(private readonly invoiceService: InvoiceService) {}

  // El patrón del evento debe ser 'order.shipped'
  @EventPattern('order.shipped')
  async handleOrderShipped(@Payload() data: any): Promise<void> {
    try {
      console.log('Evento recibido: order.shipped');
      const payload: OrderShippedPayload = data;
      console.log(`Received orderId: ${payload.orderId}`);
      await this.invoiceService.sendInvoice(payload.orderId);
    } catch (error) {
      console.error('Error handling order shipment event', error);
    }
  }
}
