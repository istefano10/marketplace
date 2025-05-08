import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceService } from './invoice.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('invoices')
export class InvoiceController {
  @EventPattern('msg_order')
  manejarMensaje(@Payload() mensaje: string) {
    console.log('✅ Mensaje recibido en InvoiceController:', mensaje);
  }
  
  constructor(private readonly invoiceService: InvoiceService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: null,
    }),
  )
  async create(
    @UploadedFile() file: any,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    if (file) {
      console.log('File received:', file.originalname);
    } else {
      console.log('Fail receiving file');
    }

    // Llamamos al servicio para crear la factura
    return this.invoiceService.createInvoice(createInvoiceDto);
  }
}
