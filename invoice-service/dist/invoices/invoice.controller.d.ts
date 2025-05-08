import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceService } from './invoice.service';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    create(file: any, createInvoiceDto: CreateInvoiceDto): Promise<import("./schemas/invoice.schema").Invoice>;
}
