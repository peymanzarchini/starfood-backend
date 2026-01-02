import { Request, Response, NextFunction } from "express";
import { cartService } from "../services/cart.service.js";
import { AddToCartInput, UpdateCartItemInput } from "../validators/schemas/cart.schema.js";

/**
 * Cart Controller
 * Handles HTTP requests for shopping cart
 */
class CartController {
  /**
   * Get user's cart
   * GET /api/cart
   */
  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const cart = await cartService.getCart(userId);

      res.success("Cart retrieved successfully", cart);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add item to cart
   * POST /api/cart/items
   */
  async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data: AddToCartInput = req.body;

      const cart = await cartService.addItem(userId, data);

      res.success("Item added to cart", cart, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update cart item quantity
   * PATCH /api/cart/items/:itemId
   */
  async updateItemQuantity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const itemId = parseInt(req.params.itemId, 10);
      const data: UpdateCartItemInput = req.body;

      const cart = await cartService.updateItemQuantity(userId, itemId, data);

      res.success("Cart item updated", cart);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove item from cart
   * DELETE /api/cart/items/:itemId
   */
  async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const itemId = parseInt(req.params.itemId, 10);

      const cart = await cartService.removeItem(userId, itemId);

      res.success("Item removed from cart", cart);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clear all items from cart
   * DELETE /api/cart
   */
  async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const cart = await cartService.clearCart(userId);

      res.success("Cart cleared", cart);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get cart item count
   * GET /api/cart/count
   */
  async getCartItemCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const count = await cartService.getCartItemCount(userId);

      res.success("Cart count retrieved", { count });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Validate cart before checkout
   * GET /api/cart/validate
   */
  async validateCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const result = await cartService.validateCart(userId);

      if (result.isValid) {
        res.success("Cart is valid", result);
      } else {
        res.fail("Some items are unavailable", result, 400);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove unavailable items from cart
   * DELETE /api/cart/unavailable
   */
  async removeUnavailableItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const cart = await cartService.removeUnavailableItems(userId);

      res.success("Unavailable items removed", cart);
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
