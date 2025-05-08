import { HydratedDocument } from 'mongoose';
export type InvoiceDocument = HydratedDocument<Invoice>;
export declare class Invoice {
    invoiceId: string;
    orderId: string;
    pdfUrl: string;
    sentAt?: Date;
}
export declare const InvoiceSchema: import("mongoose").Schema<Invoice, import("mongoose").Model<Invoice, any, any, any, import("mongoose").Document<unknown, any, Invoice, any> & Invoice & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Invoice, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Invoice>, {}> & import("mongoose").FlatRecord<Invoice> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
