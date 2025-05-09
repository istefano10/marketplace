// src/invoice/dtos/create-invoice.dto.ts
import { IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  invoiceId: string;

  @IsString()
  orderId: string;

}
