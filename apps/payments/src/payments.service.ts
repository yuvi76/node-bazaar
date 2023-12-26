import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import Stripe from 'stripe';
import { CartDocument } from '@app/common';

/**
 * Service class for handling payments.
 * @property stripe The Stripe instance.
 * @property configService The injected ConfigService instance.
 * @property cartDocument The injected CartDocument instance.
 */

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16',
    },
  );

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(CartDocument.name)
    readonly cartDocument: mongoose.Model<CartDocument>,
  ) {}

  /**
   * Creates a checkout session for the specified cart.
   * @param cartId The ID of the cart.
   * @returns A promise that resolves to the created checkout session.
   */
  async createCheckoutSession(cartId: string) {
    const [cart] = await this.cartDocument.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(cartId) },
      },
      {
        $unwind: { path: '$products', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products.product',
          foreignField: '_id',
          as: 'products.product',
        },
      },
      {
        $group: {
          _id: '$_id',
          user: { $first: '$user' },
          products: { $push: '$products' },
          status: { $first: '$status' },
          totalCartPrice: { $first: '$totalCartPrice' },
          totalQuantity: { $first: '$totalQuantity' },
          totalProducts: { $first: '$totalProducts' },
        },
      },
      {
        $project: {
          _id: 1,
          user: 1,
          'products.product.name': 1,
          'products.product.price': 1,
          'products.product.description': 1,
          'products.product.image': 1,
          'products.quantity': 1,
          status: 1,
          totalCartPrice: 1,
          totalQuantity: 1,
          totalProducts: 1,
        },
      },
    ]);

    const transformedData = cart.products.map((item) => {
      const productInfo = item.product[0];
      return {
        name: productInfo.name,
        description: productInfo.description,
        price: productInfo.price,
        image: productInfo.image,
        quantity: item.quantity,
      };
    });

    const checkoutSession = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: transformedData.map((product) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
          },
          unit_amount: parseFloat(product.price) * 100,
        },
        quantity: parseInt(product.quantity),
      })),
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
    return checkoutSession;
  }
}
