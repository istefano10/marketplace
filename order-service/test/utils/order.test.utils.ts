import { OrderStatus } from '../../src/orders/schemas/order.schema';
import { CreateOrderDto } from '../../src/orders/dto/create-order.dto';  // Ajusta el path según tu proyecto

// Puedes crear una constante para reutilizar en todas tus pruebas
export const defaultOrderDto: CreateOrderDto = {
  orderId: 'order-123',  // ID único para cada prueba
  productId: 'product-123',
  customerId: 'customer-123',
  sellerId: 'seller-123',
  price: 100,
  quantity: 2,
  status: OrderStatus.CREATED, // El status inicial
};
