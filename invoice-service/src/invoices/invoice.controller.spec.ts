import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { OrderService } from '../orders/orders.service';  
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  describe('sendInvoice', () => {
    it('should send invoice and log file name if file is uploaded', async () => {
      const file = { originalname: 'invoice.pdf' };
      const createInvoiceDto: CreateInvoiceDto = { invoiceId: 'INV-123', orderId: 'order123' };

      mockInvoiceService.sendInvoice.mockResolvedValue(undefined);

      const result = await controller.sendInvoice(file, createInvoiceDto);

      expect(result).toEqual({ message: 'Invoice processed successfully' });
      expect(mockInvoiceService.sendInvoice).toHaveBeenCalledWith(createInvoiceDto);
    });

    it('should throw an error if no file is uploaded', async () => {
      const createInvoiceDto: CreateInvoiceDto = { invoiceId: 'INV-123', orderId: 'order123' };

      await expect(controller.sendInvoice(null, createInvoiceDto)).rejects.toThrowError(
        new HttpException('No file uploaded', HttpStatus.BAD_REQUEST),
      );
    });

    it('should handle errors properly', async () => {
      const file = { originalname: 'invoice.pdf' };
      const createInvoiceDto: CreateInvoiceDto = { invoiceId: 'INV-123', orderId: 'order123' };

      mockInvoiceService.sendInvoice.mockRejectedValue(new Error('Something went wrong'));

      await expect(controller.sendInvoice(file, createInvoiceDto)).rejects.toThrowError(
        new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});
