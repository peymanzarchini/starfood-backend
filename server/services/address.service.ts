import { Address } from "../models/index.js";
import { sequelize } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import { formatAddressResponse } from "../utils/format-response/formatAddressResponse.js";
import { AddressResponse } from "../types/index.js";
import { CreateAddressInput, UpdateAddressInput } from "../validators/schemas/address.schema.js";

/**
 * Address Service
 * Handles all address business logic
 */
class AddressService {
  /**
   * Get all addresses for user
   */
  async getUserAddresses(userId: number): Promise<AddressResponse[]> {
    const addresses = await Address.findAll({
      where: { userId },
      order: [
        ["isDefault", "DESC"], // Default address first
        ["createdAt", "DESC"],
      ],
    });

    return addresses.map(formatAddressResponse);
  }

  /**
   * Get address by ID
   */
  async getAddressById(addressId: number, userId: number): Promise<AddressResponse> {
    const address = await Address.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw HttpError.notFound("Address not found");
    }

    return formatAddressResponse(address);
  }

  /**
   * Get default address for user
   */
  async getDefaultAddress(userId: number): Promise<AddressResponse | null> {
    const address = await Address.findOne({
      where: { userId, isDefault: true },
    });

    if (!address) {
      return null;
    }

    return formatAddressResponse(address);
  }

  /**
   * Create new address
   */
  async createAddress(userId: number, data: CreateAddressInput): Promise<AddressResponse> {
    // Use transaction to handle default address logic
    const address = await sequelize.transaction(async (transaction) => {
      // If this is set as default, unset other defaults
      if (data.isDefault) {
        await Address.update(
          { isDefault: false },
          { where: { userId, isDefault: true }, transaction }
        );
      }

      // Check if this is the first address
      const addressCount = await Address.count({
        where: { userId },
        transaction,
      });

      // First address is always default
      const isDefault = addressCount === 0 ? true : data.isDefault ?? false;

      // Create address
      const newAddress = await Address.create(
        {
          userId,
          title: data.title,
          street: data.street,
          city: data.city,
          postalCode: data.postalCode,
          phoneNumber: data.phoneNumber,
          latitude: data.latitude,
          longitude: data.longitude,
          isDefault,
        },
        { transaction }
      );

      return newAddress;
    });

    return formatAddressResponse(address);
  }

  /**
   * Update address
   */
  async updateAddress(
    addressId: number,
    userId: number,
    data: UpdateAddressInput
  ): Promise<AddressResponse> {
    const address = await Address.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw HttpError.notFound("Address not found");
    }

    // Use transaction if setting as default
    if (data.isDefault) {
      await sequelize.transaction(async (transaction) => {
        // Unset other defaults
        await Address.update(
          { isDefault: false },
          { where: { userId, isDefault: true }, transaction }
        );

        // Update this address
        await Address.update(
          {
            title: data.title ?? address.title,
            street: data.street ?? address.street,
            city: data.city ?? address.city,
            postalCode: data.postalCode ?? address.postalCode,
            phoneNumber: data.phoneNumber ?? address.phoneNumber,
            latitude: data.latitude ?? address.latitude,
            longitude: data.longitude ?? address.longitude,
            isDefault: true,
          },
          { where: { id: addressId }, transaction }
        );
      });
    } else {
      await Address.update(
        {
          title: data.title ?? address.title,
          street: data.street ?? address.street,
          city: data.city ?? address.city,
          postalCode: data.postalCode ?? address.postalCode,
          phoneNumber: data.phoneNumber ?? address.phoneNumber,
          latitude: data.latitude ?? address.latitude,
          longitude: data.longitude ?? address.longitude,
          isDefault: data.isDefault ?? address.isDefault,
        },
        { where: { id: addressId } }
      );
    }

    // Return updated address
    return this.getAddressById(addressId, userId);
  }

  /**
   * Set address as default
   */
  async setDefaultAddress(addressId: number, userId: number): Promise<AddressResponse> {
    const address = await Address.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw HttpError.notFound("Address not found");
    }

    await sequelize.transaction(async (transaction) => {
      // Unset all defaults for user
      await Address.update({ isDefault: false }, { where: { userId }, transaction });

      // Set this address as default
      await Address.update({ isDefault: true }, { where: { id: addressId }, transaction });
    });

    return this.getAddressById(addressId, userId);
  }

  /**
   * Delete address
   */
  async deleteAddress(addressId: number, userId: number): Promise<void> {
    const address = await Address.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw HttpError.notFound("Address not found");
    }

    const wasDefault = address.isDefault;

    await address.destroy();

    // If deleted address was default, set another one as default
    if (wasDefault) {
      const firstAddress = await Address.findOne({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });

      if (firstAddress) {
        await Address.update({ isDefault: true }, { where: { id: firstAddress.id } });
      }
    }
  }

  /**
   * Get address count for user
   */
  async getAddressCount(userId: number): Promise<number> {
    return Address.count({ where: { userId } });
  }
}

export const addressService = new AddressService();
