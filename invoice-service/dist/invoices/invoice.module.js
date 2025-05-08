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
exports.InvoiceModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const microservices_1 = require("@nestjs/microservices");
const config_1 = require("@nestjs/config");
const invoice_schema_1 = require("./schemas/invoice.schema");
const order_shipped_listener_1 = require("./listeners/order-shipped.listener");
const invoice_controller_1 = require("./invoice.controller");
const invoice_service_1 = require("./invoice.service");
let InvoiceModule = class InvoiceModule {
};
exports.InvoiceModule = InvoiceModule;
exports.InvoiceModule = InvoiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: invoice_schema_1.Invoice.name, schema: invoice_schema_1.InvoiceSchema },
            ]),
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'ORDER_RMQ_SERVICE',
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => __awaiter(void 0, void 0, void 0, function* () {
                        return ({
                            transport: microservices_1.Transport.RMQ,
                            options: {
                                urls: [configService.get('RABBITMQ_URL')],
                                queue: configService.get('RABBITMQ_QUEUE'),
                                queueOptions: { durable: false },
                            },
                        });
                    }),
                    inject: [config_1.ConfigService],
                },
            ]),
        ],
        controllers: [invoice_controller_1.InvoiceController],
        providers: [invoice_service_1.InvoiceService, order_shipped_listener_1.OrderShippedListener],
    })
], InvoiceModule);
//# sourceMappingURL=invoice.module.js.map