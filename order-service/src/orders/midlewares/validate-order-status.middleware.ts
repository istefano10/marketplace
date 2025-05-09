import {
    Injectable,
    NestMiddleware,
    BadRequestException,
    Logger,
  } from '@nestjs/common';
  import { Request, Response, NextFunction } from 'express';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Order, OrderStatus } from '../schemas/order.schema';
  
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.CREATED]: [OrderStatus.ACCEPTED, OrderStatus.REJECTED],
    [OrderStatus.ACCEPTED]: [OrderStatus.SHIPPING_IN_PROGRESS],
    [OrderStatus.SHIPPING_IN_PROGRESS]: [OrderStatus.SHIPPED],
    [OrderStatus.REJECTED]: [],
    [OrderStatus.SHIPPED]: [OrderStatus.REJECTED],
  };
  
  @Injectable()
  export class ValidateOrderStatusMiddleware implements NestMiddleware {
    private readonly logger = new Logger(ValidateOrderStatusMiddleware.name);
  
    constructor(
      @InjectModel(Order.name) private orderModel: Model<Order>,
    ) {}
  
    async use(req: Request, res: Response, next: NextFunction) {
      const { id } = req.params;
      const { status: newStatus } = req.body;
  
      this.logger.debug(`Requested new status: ${newStatus}`);
  
      if (!Object.values(OrderStatus).includes(newStatus)) {
        this.logger.warn(`❌ Invalid status provided: ${newStatus}`);
        throw new BadRequestException(`Invalid status: ${newStatus}`);
      }
  
      let order: Order | null = null;
      try {
        order = await this.orderModel.findById(id).exec();
      } catch (err) {
        this.logger.error(`❌ Error fetching order with ID ${id}: ${err.message}`);
        throw new BadRequestException('Invalid order ID');
      }
  
      if (!order) {
        this.logger.warn(`❌ Order with ID ${id} not found`);
        throw new BadRequestException(`Order with ID ${id} not found`);
      }
  
      const currentStatus = order.status;
  
      const allowedNextStatuses = validTransitions[currentStatus];
  
      if (!allowedNextStatuses.includes(newStatus)) {
        this.logger.warn(
          `❌ Invalid transition from ${currentStatus} to ${newStatus} for order ID: ${id}`,
        );
        throw new BadRequestException(
          `Invalid state transition from ${currentStatus} to ${newStatus}`,
        );
      }
  
      this.logger.log(
        `✅ Valid transition from ${currentStatus} to ${newStatus} for order ID: ${id}`,
      );
      next();
    }
  }
  