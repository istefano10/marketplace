import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { OrderService } from '../../orders/orders.service';
import { InvoiceService } from '../service/invoice.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { OrderStatus } from '../../orders/order.schema';
import { Readable } from 'stream';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let invoiceService: InvoiceService;
  let orderService: OrderService;

  const mockInvoiceService = {
    createInvoice: jest.fn(),
    sendInvoice: jest.fn(),
    findInvoiceByOrderId: jest.fn(),
  };

  const mockOrderService = {
    getOrderById: jest.fn(),
  };

  const file: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'invoice.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    buffer: Buffer.from(''),
    size: 1234,
    stream: new Readable(), // Simulamos un Readable stream vacío
    destination: 'some/directory', // Debe ser una cadena válida
    filename: 'invoice.pdf',
    path: ''
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        { provide: InvoiceService, useValue: mockInvoiceService },
        { provide: OrderService, useValue: mockOrderService },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
    invoiceService = module.get<InvoiceService>(InvoiceService);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(invoiceService).toBeDefined();
  });

  // -----------------------------------------------
  // Tests for sendInvoice (no changes here)
  // -----------------------------------------------

  describe('sendInvoice', () => {
    it('should send invoice and log file name if file is uploaded', async () => {
      const createInvoiceDto: CreateInvoiceDto = { invoiceId: 'INV-123', orderId: 'order123' };

      mockInvoiceService.sendInvoice.mockResolvedValue(undefined);

      const result = await controller.sendInvoice(file, createInvoiceDto);

      expect(result).toEqual({ message: 'Invoice processed successfully' });
      expect(mockInvoiceService.sendInvoice).toHaveBeenCalledWith(createInvoiceDto);
    });

    it('should throw an error if no file is uploaded', async () => {
      const createInvoiceDto: CreateInvoiceDto = { invoiceId: 'INV-123', orderId: 'order123' };

      // Simulamos el archivo vacío en lugar de usar null
      const nullFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: '',
        encoding: '7bit',
        mimetype: '',
        buffer: Buffer.from(''),
        size: 0,
        stream: new Readable(),
        destination: '',
        filename: '',
        path: ''
      };

      try {
        await controller.sendInvoice(nullFile, createInvoiceDto);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect(e.message).toBe('No file uploaded');
      }
    });

    it('should handle errors properly', async () => {
      const createInvoiceDto: CreateInvoiceDto = { invoiceId: 'INV-123', orderId: 'order123' };
      mockInvoiceService.sendInvoice.mockRejectedValue(new Error('Something went wrong'));

      try {
        await controller.sendInvoice(file, createInvoiceDto);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(e.message).toBe('Something went wrong');
      }
    });
  });

  // -----------------------------------------------
  // Tests for handleOrderShipped
  // -----------------------------------------------

  describe('handleOrderShipped', () => {
    it('should skip invoice creation if invoice already exists for the order', async () => {
      const orderData = { orderId: 'order123' };

      // Simulamos que ya existe una factura para esta orden
      mockInvoiceService.findInvoiceByOrderId.mockResolvedValue({ id: 'invoice123' });

      await controller.handleOrderShipped(orderData);

      // Verificamos que no se intentó crear una factura
      expect(mockInvoiceService.createInvoice).not.toHaveBeenCalled();
    });

    it('should skip invoice creation if order is not in SHIPPED status', async () => {
      const orderData = { orderId: 'order123' };
      const order = { id: 'order123', status: OrderStatus.CREATED }; // El estado no es "SHIPPED"

      // Simulamos que la orden existe, pero no está en estado "SHIPPED"
      mockOrderService.getOrderById.mockResolvedValue(order);
      mockInvoiceService.findInvoiceByOrderId.mockResolvedValue(null); // No existe una factura

      await controller.handleOrderShipped(orderData);

      // Verificamos que no se intentó crear una factura
      expect(mockInvoiceService.createInvoice).not.toHaveBeenCalled();
    });

    it('should create a new invoice if order is in SHIPPED status and no invoice exists', async () => {
      const orderData = { orderId: 'order123' };
      const order = { id: 'order123', status: OrderStatus.SHIPPED }; // El estado es "SHIPPED"

      // Simulamos que la orden está en estado SHIPPED y no tiene factura asociada
      mockOrderService.getOrderById.mockResolvedValue(order);
      mockInvoiceService.findInvoiceByOrderId.mockResolvedValue(null); // No existe una factura

      await controller.handleOrderShipped(orderData);

      // Verificamos que se haya llamado a la creación de la factura
      expect(mockInvoiceService.createInvoice).toHaveBeenCalledWith({ orderId: 'order123' });
    });

    it('should throw an error if order does not exist', async () => {
      const orderData = { orderId: 'order123' };

      // Simulamos que no encontramos el pedido
      mockOrderService.getOrderById.mockResolvedValue(null);
      mockInvoiceService.findInvoiceByOrderId.mockResolvedValue(null); // No existe una factura

      try {
        await controller.handleOrderShipped(orderData);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect(e.message).toBe('Order not found');
      }
    });
  });
});
