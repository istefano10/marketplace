"use strict";
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
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        const configService = app.get(config_1.ConfigService);
        const PORT = configService.get('PORT');
        const RABBITMQ_URI = configService.get('RABBITMQ_URI');
        const RABBITMQ_QUEUE = configService.get('RABBITMQ_QUEUE');
        if (!PORT || !RABBITMQ_URI || !RABBITMQ_QUEUE) {
            throw new Error('Missing environment variables: PORT, RABBITMQ_URL, or RABBITMQ_QUEUE');
        }
        app.connectMicroservice({
            transport: microservices_1.Transport.RMQ,
            options: {
                urls: [RABBITMQ_URI],
                queue: RABBITMQ_QUEUE,
                queueOptions: { durable: false },
            },
        });
        try {
            yield app.startAllMicroservices();
            console.log(`✅ Microservice is listening for RabbitMQ events on queue: ${RABBITMQ_QUEUE}`);
            yield app.listen(PORT);
            console.log(`🚀 Application is running on: http://localhost:${PORT}`);
        }
        catch (error) {
            console.error('❌ Error starting the application:', error);
            process.exit(1);
        }
    });
}
bootstrap();
//# sourceMappingURL=main.js.map