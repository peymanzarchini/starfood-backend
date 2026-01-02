import { Cart, CartItem, Product } from "../models/index.js";
import { HttpError } from "../utils/httpError.js";
import {
  formatCartResponse,
  createEmptyCartResponse,
} from "../utils/format-response/formatCartResponse.js";
import { CartResponse } from "../types/index.js";
import { AddToCartInput, UpdateCartItemInput } from "../validators/schemas/cart.schema.js";

class CartService {
  /**
   * Get or create cart for user
   */
  private async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }
    return cart;
  }

  /**
   * Get cart with items and products
   */
  private async getCartWithItems(userId: number): Promise<Cart | null> {
    return Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price", "discount", "imageUrl", "isAvailable"],
            },
          ],
        },
      ],
    });
  }

  /**
   * Get user's cart
   */
  async getCart(userId: number): Promise<CartResponse> {
    const cart = await this.getCartWithItems(userId);

    if (!cart) {
      return createEmptyCartResponse();
    }

    return formatCartResponse(cart);
  }

  /**
   * Add item to cart
   */
  async addItem(userId: number, data: AddToCartInput): Promise<CartResponse> {
    const product = await Product.findByPk(data.productId);

    if (!product) {
      throw HttpError.notFound("Product not found");
    }

    if (!product.isAvailable) {
      throw HttpError.badRequest("Product is not available");
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId: data.productId,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + data.quantity;

      if (newQuantity > 99) {
        throw HttpError.badRequest("Quantity cannot exceed 99");
      }

      await existingItem.update({ quantity: newQuantity });
    } else {
      await CartItem.create({
        cartId: cart.id,
        productId: data.productId,
        quantity: data.quantity,
      });
    }

    return this.getCart(userId);
  }

  /**
   * Update cart item quantity
   */
  async updateItemQuantity(
    userId: number,
    itemId: number,
    data: UpdateCartItemInput
  ): Promise<CartResponse> {
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      throw HttpError.notFound("Cart not found");
    }

    const cartItem = await CartItem.findOne({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["isAvailable"],
        },
      ],
    });

    if (!cartItem) {
      throw HttpError.notFound("Cart item not found");
    }

    if (!cartItem.product?.isAvailable) {
      throw HttpError.badRequest("Product is no longer available");
    }

    await cartItem.update({ quantity: data.quantity });

    return this.getCart(userId);
  }

  /**
   * Remove item from cart
   */
  async removeItem(userId: number, itemId: number): Promise<CartResponse> {
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      throw HttpError.notFound("Cart not found");
    }

    const cartItem = await CartItem.findOne({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      throw HttpError.notFound("Cart item not found");
    }

    await cartItem.destroy();
    return this.getCart(userId);
  }

  /**
   * Clear all items from cart
   */
  async clearCart(userId: number): Promise<CartResponse> {
    const cart = await Cart.findOne({ where: { userId } });

    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
    }
    return createEmptyCartResponse();
  }

  /**
   * Get cart item count (for header badge)
   */

  async getCartItemCount(userId: number): Promise<number> {
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          attributes: ["quantity"],
        },
      ],
    });
    if (!cart || !cart.items) {
      return 0;
    }
    return cart.items.reduce((sum: number, item) => sum + item.quantity, 0);
  }

  /**
   * Validate cart before checkout
   * Returns list of unavailable items
   */

  async validateCart(userId: number): Promise<{
    isValid: boolean;
    unavailableItems: string[];
    cart: CartResponse;
  }> {
    const cart = await this.getCartWithItems(userId);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw HttpError.badRequest("Cart is empty");
    }

    const unavailableItems: string[] = [];

    for (const item of cart.items) {
      if (!item.product?.isAvailable) {
        unavailableItems.push(item.product?.name || `Product ID: ${item.productId}`);
      }
    }
    return {
      isValid: unavailableItems.length === 0,
      unavailableItems,
      cart: formatCartResponse(cart),
    };
  }
  /**
   * Remove unavailable items from cart
   */
  async removeUnavailableItems(userId: number): Promise<CartResponse> {
    const cart = await this.getCartWithItems(userId);

    if (!cart || !cart.items) {
      return createEmptyCartResponse();
    }

    const unavailableItemIds = cart.items
      .filter((item) => !item.product?.isAvailable)
      .map((item) => item.id);

    if (unavailableItemIds.length > 0) {
      await CartItem.destroy({
        where: { id: unavailableItemIds },
      });
    }

    return this.getCart(userId);
  }
}

export const cartService = new CartService();
