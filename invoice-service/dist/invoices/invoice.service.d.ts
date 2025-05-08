import { Model } from "mongoose";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { Invoice } from "./schemas/invoice.schema";
export declare class InvoiceService {
    private invoiceModel;
    constructor(invoiceModel: Model<Invoice>);
    createInvoice(dto: CreateInvoiceDto): Promise<Invoice>;
    sendInvoice(orderId: string): Promise<void>;
}
