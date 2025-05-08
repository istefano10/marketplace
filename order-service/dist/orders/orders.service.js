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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const microservices_1 = require("@nestjs/microservices");
const order_schema_1 = require("./schemas/order.schema");
const rmq_service_1 = require("./rmq/rmq.service");
let OrdersService = class OrdersService {
    constructor(orderModel, client, rmqService) {
        this.orderModel = orderModel;
        this.client = client;
        this.rmqService = rmqService;
    }
    createOrder(createOrderDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = new this.orderModel(createOrderDto);
                return yield order.save();
            }
            catch (error) {
                throw new common_1.BadRequestException('Error creating the order: ' + error.message);
            }
        });
    }
    getOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.orderModel.find().exec();
            }
            catch (error) {
                throw new common_1.BadRequestException('Error retrieving orders: ' + error.message);
            }
        });
    }
    getOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.orderModel.findById(id).exec();
                if (!order) {
                    throw new common_1.NotFoundException(`Order with ID ${id} not found`);
                }
                return order;
            }
            catch (error) {
                if (error.name === 'CastError') {
                    throw new common_1.BadRequestException('Invalid order ID format');
                }
                throw new common_1.NotFoundException(`Order with ID ${id} not found`);
            }
        });
    }
    updateOrderStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.orderModel.findById(id).exec();
                if (!order) {
                    throw new common_1.NotFoundException(`Order with ID ${id} not found`);
                }
                order.status = status;
                yield order.save();
                if (status === order_schema_1.OrderStatus.SHIPPED) {
                    this.rmqService.emitOrderShipped(order.orderId);
                }
                return order;
            }
            catch (error) {
                if (error.name === 'CastError') {
                    throw new common_1.BadRequestException('Invalid order ID format');
                }
                throw new common_1.BadRequestException('Error updating order status: ' + error.message);
            }
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, common_1.Inject)('ORDER_RMQ_SERVICE')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        microservices_1.ClientProxy,
        rmq_service_1.RmqService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map