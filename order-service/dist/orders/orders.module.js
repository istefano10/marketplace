"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const microservices_1 = require("@nestjs/microservices");
const config_1 = require("@nestjs/config");
const orders_controller_1 = require("./orders.controller");
const orders_service_1 = require("./orders.service");
const rmq_service_1 = require("./rmq/rmq.service");
const order_schema_1 = require("./schemas/order.schema");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema }]),
            config_1.ConfigModule,
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'ORDER_RMQ_SERVICE',
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => __awaiter(void 0, void 0, void 0, function* () {
                        return ({
                            transport: microservices_1.Transport.RMQ,
                            options: {
                                urls: [configService.get('RABBITMQ_URI')],
                                queue: configService.get('RABBITMQ_QUEUE'),
                                queueOptions: { durable: false },
                            },
                        });
                    }),
                    inject: [config_1.ConfigService],
                },
            ]),
        ],
        controllers: [orders_controller_1.OrdersController],
        providers: [
            orders_service_1.OrdersService,
            rmq_service_1.RmqService,
        ],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map