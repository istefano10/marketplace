import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Param,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderService } from '../../orders/orders.service';
import { OrderStatus } from '../../orders/order.schema';
import { InvoiceService } from '../service/invoice.service';
import { Express } from 'express';
import * as multer from 'multer';
import { Types } from 'mongoose';

@Controller('invoices')
export class InvoiceController {
  @EventPattern('msg_order')
  async handleOrderShipped(@Payload() orderData) {
    const { orderId } = orderData;
    console.log(`Order with ID: ${orderId} has been shipped, processing invoice.`);

    // 1. Verify if invoice with this orderId exist
    const existingInvoice = await this.invoiceService.findInvoiceByOrderId(orderId);
    if (existingInvoice) {
      console.log('Invoice already exists for this order.');
      return;
    }

    // 2. Verify if is order is in SHIPPED status
    const order = await this.orderService.getOrderById(orderId);
    if (order && order.status !== OrderStatus.SHIPPED) {
      console.log('Order is not in SHIPPED state, skipping invoice creation.');
      return;
    }

    // 3. Create new invoice
    await this.invoiceService.createInvoice({ orderId });
  }

  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly orderService: OrderService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage(),
  }))
  async sendInvoice(
    @UploadedFile() file: Express.Multer.File,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    try {
      if (file) {
        console.log('File received:', file.originalname);
      } else {
        console.log('Fail receiving file');
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      await this.invoiceService.sendInvoice(createInvoiceDto);

      return { message: 'Invoice processed successfully' };
    } catch (error) {
      console.error('Error during invoice processing:', error.message);

      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getInvoice(@Param('id') id: string) {
    try {
      return await this.invoiceService.getInvoice(id);
    } catch (error) {
      console.error(`Error getting invoice with id ${id}:`, error.message);
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }
  }
}
