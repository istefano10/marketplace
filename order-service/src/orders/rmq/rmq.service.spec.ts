import { Test, TestingModule } from '@nestjs/testing';
import { RmqService } from './rmq.service';
import { ClientProxy } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';

describe('RmqService', () => {
  let rmqService: RmqService;
  let clientProxyMock: ClientProxy;

  beforeEach(async () => {
    // Crear el mock de ClientProxy
    clientProxyMock = {
      emit: jest.fn(), // Mock del método emit
    } as unknown as ClientProxy;  // Aseguramos que TypeScript lo reconozca como un ClientProxy

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RmqService,
        { provide: 'ORDER_RMQ_SERVICE', useValue: clientProxyMock },
      ],
    }).compile();

    rmqService = module.get<RmqService>(RmqService);
  });

  it('should be defined', () => {
    expect(rmqService).toBeDefined();
  });

  it('should emit order shipped message successfully', () => {
    const orderId = '12345';
    const emitObservable = of(null);  // Simulamos un Observable exitoso

    // Simulamos que `client.emit` devuelve un Observable exitoso
    (clientProxyMock.emit as jest.Mock).mockReturnValue(emitObservable);

    const emitSpy = jest.spyOn(rmqService['logger'], 'log');  // Mock de logger

    // Llamada al método
    rmqService.emitOrderShipped(orderId);

    // Verificamos que `emit` fue llamado con el valor correcto
    expect(clientProxyMock.emit).toHaveBeenCalledWith('msg_order', { orderId });

    // Verificamos que se haya registrado un log de éxito
    expect(emitSpy).toHaveBeenCalledWith(`Successfully emitted order shipped message for orderId: ${orderId}`);
  });

  it('should handle error when emitting order shipped message', () => {
    const orderId = '12345';
    const emitObservable = throwError(() => new Error('Failed to emit'));  // Nueva sintaxis para lanzar un error

    // Simulamos que `client.emit` devuelve un Observable con error
    (clientProxyMock.emit as jest.Mock).mockReturnValue(emitObservable);

    const emitErrorSpy = jest.spyOn(rmqService['logger'], 'error');  // Mock de logger para errores

    // Llamada al método
    rmqService.emitOrderShipped(orderId);

    // Verificamos que `emit` fue llamado con el valor correcto
    expect(clientProxyMock.emit).toHaveBeenCalledWith('msg_order', { orderId });

    // Verificamos que se haya registrado un log de error
    expect(emitErrorSpy).toHaveBeenCalledWith(
      `Failed to emit order shipped message for orderId: ${orderId}`,
      expect.any(String), // Verificamos que el error contiene algún stack trace
    );
  });

  it('should handle catchError correctly and log error when emit fails', () => {
    const orderId = '12345';
    const emitObservable = throwError(() => new Error('Network Error'));  // Nueva sintaxis para lanzar un error

    // Simulamos que `client.emit` devuelve un Observable con error
    (clientProxyMock.emit as jest.Mock).mockReturnValue(emitObservable);

    const errorSpy = jest.spyOn(rmqService['logger'], 'error');  // Mock de logger para errores

    // Llamada al método
    rmqService.emitOrderShipped(orderId);

    // Verificamos que el error fue capturado por el catchError
    expect(errorSpy).toHaveBeenCalledWith(
      `Failed to emit order shipped message for orderId: ${orderId}`,
      expect.any(String), // Verificamos que el error contiene algún stack trace
    );
  });
});
