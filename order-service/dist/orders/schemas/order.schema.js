"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.Order = exports.OrderStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["CREATED"] = "CREATED";
    OrderStatus["ACCEPTED"] = "ACCEPTED";
    OrderStatus["REJECTED"] = "REJECTED";
    OrderStatus["SHIPPING_IN_PROGRESS"] = "SHIPPING_IN_PROGRESS";
    OrderStatus["SHIPPED"] = "SHIPPED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "customerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "sellerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Order.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Order.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: OrderStatus, default: OrderStatus.CREATED }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Order);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
//# sourceMappingURL=order.schema.js.map