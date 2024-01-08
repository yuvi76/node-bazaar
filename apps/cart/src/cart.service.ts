import {
  Injectable,
  HttpStatus,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import {
  BaseResponse,
  MESSAGE,
  ErrorHandlerService,
  UserDocument,
  ProductDocument,
  CartDocument,
  PAYMENTS_SERVICE,
} from '@app/common';
import { CartRepository } from './cart.repository';
import { CreateCartDto } from './dto/create-cart.dto';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

/**
 * Service class for managing cart data.
 */
@Injectable()
export class CartService {
  /**
   * Creates an instance of CartService.
   * @param cartRepository The injected CartRepository instance.
   * @param errorHandlerService The injected ErrorHandlerService instance.
   * @param cartDocument The injected CartDocument instance.
   * @param productDocument The injected ProductDocument instance.
   */
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly errorHandlerService: ErrorHandlerService,
    @InjectModel(CartDocument.name)
    readonly cartDocument: mongoose.Model<CartDocument>,
    @InjectModel(ProductDocument.name)
    readonly productDocument: mongoose.Model<ProductDocument>,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  /**
   * Add a product to the cart.
   * @param createCartDto The cart to add the product to.
   * @param user The user to add the product to the cart.
   * @returns The updated cart.
   */
  async addProductToCart(
    createCartDto: CreateCartDto,
    user: UserDocument,
  ): Promise<BaseResponse> {
    try {
      const product = await this.productDocument.findOne({
        _id: createCartDto.product,
      });
      if (!product) {
        throw new NotFoundException(MESSAGE.PRODUCT_NOT_FOUND);
      }
      let cart;
      cart = await this.cartDocument.findOne({
        user: user._id,
      });

      if (cart) {
        const productIndex = cart.products.findIndex(
          (product) => product.product.toString() == createCartDto.product,
        );

        if (productIndex > -1) {
          const existingProduct = cart.products[productIndex];
          existingProduct.quantity += createCartDto.quantity;
          existingProduct.totalPrice = parseFloat(
            (existingProduct.quantity * product.price).toFixed(2),
          );
          cart.products[productIndex] = existingProduct;
          cart.totalCartPrice = parseFloat(
            cart.totalCartPrice +
              parseFloat(product.price.toFixed(2)) * createCartDto.quantity,
          ).toFixed(2);
          cart.totalQuantity += createCartDto.quantity;
        } else {
          // if the product does not exist in the cart, add the product to the cart
          cart.products.push({
            product: new mongoose.Types.ObjectId(createCartDto.product),
            quantity: createCartDto.quantity,
            price: parseFloat(product.price.toFixed(2)),
            totalPrice:
              parseFloat(product.price.toFixed(2)) * createCartDto.quantity,
          });
          cart.totalCartPrice = parseFloat(
            cart.totalCartPrice +
              parseFloat(product.price.toFixed(2)) * createCartDto.quantity,
          ).toFixed(2);
          cart.totalQuantity += createCartDto.quantity;
          cart.totalProducts += 1;
        }
        await cart.save();
      } else {
        cart = await this.cartRepository.create({
          user: user._id.toString(),
          products: [
            {
              product: new mongoose.Types.ObjectId(createCartDto.product),
              quantity: createCartDto.quantity,
              price: parseFloat(product.price.toFixed(2)),
              totalPrice:
                parseFloat(product.price.toFixed(2)) * createCartDto.quantity,
            },
          ],
          status: true,
          totalCartPrice:
            parseFloat(product.price.toFixed(2)) * createCartDto.quantity,
          totalQuantity: createCartDto.quantity,
          totalProducts: 1,
        });
      }

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.PRODUCT_ADD_TO_CART,
        data: cart,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Get the cart for the logged in user.
   * @param user The user to get the cart for.
   * @returns The cart for the logged in user.
   */
  async getCart(user: UserDocument): Promise<BaseResponse> {
    try {
      const [cart] = await this.cartDocument.aggregate([
        {
          $match: { user: new mongoose.Types.ObjectId(user._id) },
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
          $unwind: {
            path: '$products.product',
            preserveNullAndEmptyArrays: true,
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
            'products.product._id': 1,
            'products.product.name': 1,
            'products.product.price': 1,
            'products.product.description': 1,
            'products.product.image': 1,
            'products.quantity': 1,
            'products.price': 1,
            'products.totalPrice': 1,
            status: 1,
            totalCartPrice: 1,
            totalQuantity: 1,
            totalProducts: 1,
          },
        },
      ]);

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.CART_RETRIEVED,
        data: cart,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Clear the cart for the logged in user.
   * @param user The user to clear the cart for.
   * @returns The cart for the logged in user.
   */
  async clear(user: UserDocument): Promise<BaseResponse> {
    try {
      await this.cartRepository.deleteMany({ user: user._id });

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.CART_CLEARED,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Remove a product from the cart.
   * @param productId The product to remove from the cart.
   * @param user The user to remove the product from the cart.
   * @returns The updated cart.
   */
  async removeProduct(
    productId: string,
    user: UserDocument,
  ): Promise<BaseResponse> {
    try {
      const product = await this.productDocument.findOne({
        _id: productId,
      });
      if (!product) {
        throw new NotFoundException(MESSAGE.PRODUCT_NOT_FOUND);
      }

      const cart = await this.cartDocument.findOne({
        user: user._id,
      });

      if (cart) {
        if (cart.totalProducts === 1) {
          await this.cartRepository.findOneAndDelete({ user: user._id });
        } else {
          const productIndex = cart.products.findIndex(
            (product) => product.product.toString() === productId,
          );

          if (productIndex > -1) {
            const existingProduct = cart.products[productIndex];
            cart.totalCartPrice -= Number(existingProduct.totalPrice);
            cart.totalQuantity -= existingProduct.quantity;
            cart.totalProducts -= 1;
            cart.products.splice(productIndex, 1);
            await cart.save();
          }
        }
      }

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.PRODUCT_REMOVED_FROM_CART,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Checkout the cart for the logged in user.
   * @param user The user to checkout the cart for.
   * @returns The cart for the logged in user.
   */
  async checkout(user: UserDocument): Promise<any> {
    try {
      const cart = await this.cartDocument.findOne({
        user: user._id,
      });

      if (!cart) {
        throw new NotFoundException(MESSAGE.CART_NOT_FOUND);
      }

      return this.paymentsService
        .send('create_checkout_session', cart._id)
        .pipe(map((payment) => payment));
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Update the quantity of a product in the cart.
   * @param productId The product to update the quantity for.
   * @param quantity The new quantity for the product.
   * @param user The user to update the quantity for.
   * @returns The updated cart.
   */
  async updateQuantity(
    productId: string,
    quantity: number,
    user: UserDocument,
  ): Promise<BaseResponse> {
    try {
      const product = await this.productDocument.findOne({
        _id: productId,
      });
      if (!product) {
        throw new NotFoundException(MESSAGE.PRODUCT_NOT_FOUND);
      }

      const cart = await this.cartDocument.findOne({
        user: user._id,
      });

      if (cart) {
        const productIndex = cart.products.findIndex(
          (product) => product.product.toString() === productId,
        );

        if (productIndex > -1) {
          const existingProduct = cart.products[productIndex];
          cart.totalCartPrice -= Number(existingProduct.totalPrice);
          cart.totalQuantity -= existingProduct.quantity;
          cart.products[productIndex].quantity = quantity;
          cart.products[productIndex].totalPrice = parseFloat(
            (quantity * product.price).toFixed(2),
          );
          cart.markModified('products');
          cart.totalCartPrice = parseFloat(
            (
              parseFloat(cart.totalCartPrice.toString()) +
              parseFloat(product.price.toFixed(2)) * quantity
            ).toFixed(2),
          );
          cart.totalQuantity += quantity;
          await cart.save();
        }
      }

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.PRODUCT_ADD_TO_CART,
        data: cart,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}
