import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from '../schemas/invoice.schema';

// Invoice Service to handle invoice-related actions (creating, sending, retrieving invoices)
@Injectable()
export class InvoiceService {
  constructor(@InjectModel(Invoice.name) private invoiceModel: Model<Invoice>) { }

  /**
   * Creates a new invoice for an order.
   * The invoice is created with an initial `sentAt` field as `null`.
   * @param orderData The order information to create the invoice (orderId)
   */
  async createInvoice(orderData: { orderId: string }) {
    // Creates a new invoice with the order ID and a generated invoice ID
    const newInvoice = new this.invoiceModel({
      invoiceId: `INV-${orderData.orderId}`,
      orderId: orderData.orderId,
      sentAt: null, // Initially, the invoice is not sent
    });

    try {
      // Saves the new invoice to the database
      await newInvoice.save();
      console.log(`Invoice ${newInvoice.invoiceId} is created`);
    } catch (error) {
      // If there's an error while saving, log the error
      console.log('Error creating invoice:', error);
    }
  }

  /**
   * Sends an invoice (updates the `sentAt` field with the current timestamp).
   * If the invoice is already sent or not found, an error is thrown.
   * @param body The invoice data (invoiceId, orderId) to find and send the invoice
   * @returns Promise that resolves when the invoice is sent successfully
   * @throws Error if the invoice is not found or already sent
   */
  async sendInvoice(createInvoiceDto: { invoiceId: string; orderId: string }) {
    // Buscar la factura por invoiceId
    const invoice = await this.invoiceModel.findOne({ invoiceId: createInvoiceDto.invoiceId });

    if (!invoice || invoice.sentAt) {
      throw new Error('Invoice not found or already sent');
    }

    // Actualizar la propiedad sentAt
    invoice.sentAt = new Date();

    // Guardar la factura
    await invoice.save();
    console.log(`Invoice ${invoice.invoiceId} with orderId ${invoice.orderId} sent at ${invoice.sentAt}`);
    // Devolver la factura actualizada con la propiedad sentAt
    return invoice;
  }


  /**
   * Finds an invoice by its associated orderId.
   * @param orderId The ID of the order to search for
   * @returns The invoice corresponding to the given orderId, or null if not found
   */
  async findInvoiceByOrderId(orderId: string): Promise<Invoice | null> {
    // Searches for an invoice with the provided orderId
    return this.invoiceModel.findOne({ orderId }).exec();
  }
}
