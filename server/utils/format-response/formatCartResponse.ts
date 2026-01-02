import { Cart } from "../../models/cart.model.js";
import { CartItem } from "../../models/cartItem.model.js";
import { CartResponse, CartItemResponse } from "../../types/index.js";

/**
 * Format cart item for response
 */
export function formatCartItemResponse(cartItem: CartItem): CartItemResponse {
  const product = cartItem.product!;
  const finalPrice =
    product.discount > 0 ? Math.round(product.price * (1 - product.discount / 100)) : product.price;

  return {
    id: cartItem.id,
    quantity: cartItem.quantity,
    product: {
      id: product.id,
      name: product.name,
      price: product.price,
      finalPrice,
      discount: product.discount,
      imageUrl: product.imageUrl,
      isAvailable: product.isAvailable,
    },
    itemTotal: finalPrice * cartItem.quantity,
  };
}

/**
 * Format cart for response with calculations
 */
export function formatCartResponse(cart: Cart): CartResponse {
  const items = cart.items || [];
  const formattedItems = items.map(formatCartItemResponse);

  // Calculate totals
  let subtotal = 0;
  let totalDiscount = 0;

  items.forEach((item) => {
    const product = item.product!;
    const originalPrice = product.price * item.quantity;
    const finalPrice =
      product.discount > 0
        ? Math.round(product.price * (1 - product.discount / 100)) * item.quantity
        : originalPrice;

    subtotal += originalPrice;
    totalDiscount += originalPrice - finalPrice;
  });

  const total = subtotal - totalDiscount;

  return {
    id: cart.id,
    items: formattedItems,
    itemCount: items.reduce((sum: number, item) => sum + item.quantity, 0),
    subtotal,
    totalDiscount,
    total,
  };
}

/**
 * Create empty cart response
 */
export function createEmptyCartResponse(): CartResponse {
  return {
    id: null,
    items: [],
    itemCount: 0,
    subtotal: 0,
    totalDiscount: 0,
    total: 0,
  };
}
