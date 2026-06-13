import { Request, Response, NextFunction } from "express";
import { addressService } from "../services/address.service.js";
import { CreateAddressInput, UpdateAddressInput } from "../validators/schemas/address.schema.js";
import { getPaginationMeta, normalizePagination } from "../utils/pagination.js";

class AddressController {
  async getUserAddresses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const pagination = normalizePagination(Number(req.query.page), Number(req.query.limit));

      const { items, totalItems } = await addressService.getUserAddresses(
        userId,
        pagination.page,
        pagination.limit,
      );
      const paginationMeta = getPaginationMeta(totalItems, pagination.page, pagination.limit);

      res.success("Addresses retrieved successfully", items, 200, paginationMeta);
    } catch (error) {
      next(error);
    }
  }

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
