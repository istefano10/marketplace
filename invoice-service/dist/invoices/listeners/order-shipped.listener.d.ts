import { InvoiceService } from '../invoice.service';
export declare class OrderShippedListener {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    handleOrderShipped(data: any): Promise<void>;
}
