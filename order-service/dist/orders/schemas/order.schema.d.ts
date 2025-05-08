import { Document } from 'mongoose';
export type OrderDocument = Order & Document;
export declare enum OrderStatus {
    CREATED = "CREATED",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    SHIPPING_IN_PROGRESS = "SHIPPING_IN_PROGRESS",
    SHIPPED = "SHIPPED"
}
export declare class Order {
    orderId: string;
    productId: string;
    customerId: string;
    sellerId: string;
    price: number;
    quantity: number;
    status: OrderStatus;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any> & Order & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}> & import("mongoose").FlatRecord<Order> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
