import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { Invoice } from "./schemas/invoice.schema";

// src/invoice/services/invoice.service.ts
@Injectable()
export class InvoiceService {
  constructor(@InjectModel(Invoice.name) private invoiceModel: Model<Invoice>) {}

  async createInvoice(dto: CreateInvoiceDto): Promise<Invoice> {
    const invoice = new this.invoiceModel(dto);
    return await invoice.save();
  }

  async sendInvoice(orderId: string): Promise<void> {
    const invoice = await this.invoiceModel.findOne({ orderId });
    if (!invoice || invoice.sentAt) return;

    invoice.sentAt = new Date();
    await invoice.save();
    console.log(`Invoice for order ${orderId} sent at ${invoice.sentAt}`);
  }
}
