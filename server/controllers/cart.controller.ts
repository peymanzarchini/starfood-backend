import { Request, Response, NextFunction } from "express";
import { cartService } from "../services/cart.service.js";
import { AddToCartInput, UpdateCartItemInput } from "../validators/schemas/cart.schema.js";

class CartController {
  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const cart = await cartService.getCart(userId);

      res.success("Cart retrieved successfully", cart);
    } catch (error) {
      next(error);
    }
  }

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

  async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const cart = await cartService.clearCart(userId);

      res.success("Cart cleared", cart);
    } catch (error) {
      next(error);
    }
  }

  async getCartItemCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const count = await cartService.getCartItemCount(userId);

      res.success("Cart count retrieved", { count });
    } catch (error) {
      next(error);
    }
  }

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

  async removeUnavailableItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const cart = await cartService.removeUnavailableItems(userId);

      res.success("Unavailable items removed", cart);
    } catch (error) {
      next(error);
    }
  }

  async previewDiscount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { code } = req.query;

      if (!code || typeof code !== "string") {
        res.fail("Discount code is required", null, 400);
        return;
      }

      const result = await cartService.previewDiscount(userId, code);

      if (result.isValid) {
        res.success("Discount preview", result);
      } else {
        res.fail(result.message, result, 400);
      }
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
