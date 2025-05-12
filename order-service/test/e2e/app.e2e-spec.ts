import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';  
import { RmqService } from '../../src/orders/rmq/rmq.service';
import { defaultOrderDto } from '../utils/order.test.utils'; 
import { Order } from 'src/orders/schemas/order.schema';

jest.setTimeout(20000); 

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let rmqService: RmqService;
  let mongoServer: MongoMemoryServer;

  let createdOrder;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
    })
      .overrideProvider(RmqService)  
      .useValue({
        emitOrderShipped: jest.fn().mockImplementation((orderId) => {
          console.log(`Mock emitOrderShipped called with orderId: ${orderId}`);
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    rmqService = moduleFixture.get(RmqService);  
  });

  afterAll(async () => {
    if (app) await app.close();
    if (mongoServer) await mongoServer.stop();
  });

  it('should create a new order', async () => {
    const response = await request(app.getHttpServer())
      .post('/orders')
      .send(defaultOrderDto)  
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.productId).toEqual(defaultOrderDto.productId);
    expect(response.body.quantity).toEqual(defaultOrderDto.quantity);
    createdOrder = response.body;  
  });

  it('should retrieve all orders', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should retrieve an order by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/orders/${createdOrder._id}`)
      .expect(200);

    expect(response.body._id).toEqual(createdOrder._id);
    expect(response.body.productId).toBeDefined();
    expect(response.body.quantity).toBeDefined();
  });

  it('should return 404 for non-existent order', async () => {
    const nonExistentOrderId = '60b7c7f8f8f8f8f8f8f8f8f8';
    await request(app.getHttpServer())
      .get(`/orders/${nonExistentOrderId}`)
      .expect(404);
  });

  it('should return 400 for invalid order ID format', async () => {
    const invalidId = 'invalid-id';
    await request(app.getHttpServer())
      .get(`/orders/${invalidId}`)
      .expect(400);
  });

  it('should update the status of an order and send event to rabbitMQ', async () => {
    await request(app.getHttpServer())
      .patch(`/orders/${createdOrder._id}/status`)
      .send({ status: 'ACCEPTED' })
      .expect(200);
      await request(app.getHttpServer())
      .patch(`/orders/${createdOrder._id}/status`)
      .send({ status: 'SHIPPING_IN_PROGRESS' })
      .expect(200);
      const response = await request(app.getHttpServer())
      .patch(`/orders/${createdOrder._id}/status`)
      .send({ status: 'SHIPPED' })
      .expect(200);
  
    expect(response.body.status).toEqual('SHIPPED');
    expect(rmqService.emitOrderShipped).toHaveBeenCalledWith(createdOrder.orderId);
  });
  

  it('should return 400 for invalid status update', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/orders/${createdOrder._id}/status`)
      .send({ status: 'INVALID_STATUS' })
      .expect(400);

    expect(response.body.message).toBeDefined();
  });

  it('should handle error on order creation (invalid data)', async () => {
    const invalidOrder = { ...defaultOrderDto, price: -1 };

    const response = await request(app.getHttpServer())
      .post('/orders')
      .send(invalidOrder)
      .expect(400);

    expect(response.body.message).toBeDefined();
  });
});
