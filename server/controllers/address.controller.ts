import { Request, Response, NextFunction } from "express";
import { addressService } from "../services/address.service.js";
import { CreateAddressInput, UpdateAddressInput } from "../validators/schemas/address.schema.js";

/**
 * Address Controller
 * Handles HTTP requests for addresses
 */
class AddressController {
  /**
   * Get all addresses for current user
   * GET /api/addresses
   */
  async getUserAddresses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const addresses = await addressService.getUserAddresses(userId);

      res.success("Addresses retrieved successfully", addresses);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get address by ID
   * GET /api/addresses/:id
   */
  async getAddressById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const addressId = parseInt(req.params.id, 10);

      const address = await addressService.getAddressById(addressId, userId);

      res.success("Address retrieved successfully", address);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get default address
   * GET /api/addresses/default
   */
  async getDefaultAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const address = await addressService.getDefaultAddress(userId);

      if (!address) {
        res.success("No default address found", null);
        return;
      }

      res.success("Default address retrieved successfully", address);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new address
   * POST /api/addresses
   */
  async createAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data: CreateAddressInput = req.body;

      const address = await addressService.createAddress(userId, data);

      res.success("Address created successfully", address, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update address
   * PUT /api/addresses/:id
   */
  async updateAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const addressId = parseInt(req.params.id, 10);
      const data: UpdateAddressInput = req.body;

      const address = await addressService.updateAddress(addressId, userId, data);

      res.success("Address updated successfully", address);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Set address as default
   * PATCH /api/addresses/:id/default
   */
  async setDefaultAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const addressId = parseInt(req.params.id, 10);

      const address = await addressService.setDefaultAddress(addressId, userId);

      res.success("Default address updated successfully", address);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete address
   * DELETE /api/addresses/:id
   */
  async deleteAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const addressId = parseInt(req.params.id, 10);

      await addressService.deleteAddress(addressId, userId);

      res.success("Address deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }
}

export const addressController = new AddressController();
