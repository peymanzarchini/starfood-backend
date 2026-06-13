import { Address } from "../models/index.js";
import { sequelize } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import { formatAddressResponse } from "../utils/format-response/formatAddressResponse.js";
import { AddressResponse } from "../types/index.js";
import { CreateAddressInput, UpdateAddressInput } from "../validators/schemas/address.schema.js";
import { getOffset } from "../utils/pagination.js";

class AddressService {
  async getUserAddresses(
    userId: number,
    page = 1,
    limit = 100,
  ): Promise<{ items: AddressResponse[]; totalItems: number }> {
    const offset = getOffset(page, limit);

    const { count, rows } = await Address.findAndCountAll({
      where: { userId },
      order: [
        ["isDefault", "DESC"],
        ["createdAt", "DESC"],
      ],
      limit,
      offset,
    });

    return { items: rows.map(formatAddressResponse), totalItems: count };
  }

  async getAddressById(addressId: number, userId: number): Promise<AddressResponse> {
    const address = await Address.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw HttpError.notFound("Address not found");
    }

    return formatAddressResponse(address);
  }

  async getDefaultAddress(userId: number): Promise<AddressResponse | null> {
    const address = await Address.findOne({
      where: { userId, isDefault: true },
    });

    if (!address) {
      return null;
    }

    return formatAddressResponse(address);
  }

  async createAddress(userId: number, data: CreateAddressInput): Promise<AddressResponse> {
    const address = await sequelize.transaction(async (transaction) => {
      if (data.isDefault) {
        await Address.update(
          { isDefault: false },
          { where: { userId, isDefault: true }, transaction },
        );
      }

      const addressCount = await Address.count({
        where: { userId },
        transaction,
      });

      const isDefault = addressCount === 0 ? true : (data.isDefault ?? false);

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
        { transaction },
      );

      return newAddress;
    });

    return formatAddressResponse(address);
  }

  async updateAddress(
    addressId: number,
    userId: number,
    data: UpdateAddressInput,
  ): Promise<AddressResponse> {
    const address = await Address.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw HttpError.notFound("Address not found");
    }

    if (data.isDefault) {
      await sequelize.transaction(async (transaction) => {
        await Address.update(
          { isDefault: false },
          { where: { userId, isDefault: true }, transaction },
        );

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
          { where: { id: addressId }, transaction },
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
        { where: { id: addressId } },
      );
    }

    return this.getAddressById(addressId, userId);
  }

  async setDefaultAddress(addressId: number, userId: number): Promise<AddressResponse> {
    const address = await Address.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw HttpError.notFound("Address not found");
    }

    await sequelize.transaction(async (transaction) => {
      await Address.update({ isDefault: false }, { where: { userId }, transaction });

      await Address.update({ isDefault: true }, { where: { id: addressId }, transaction });
    });

    return this.getAddressById(addressId, userId);
  }

  async deleteAddress(addressId: number, userId: number): Promise<void> {
    const address = await Address.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw HttpError.notFound("Address not found");
    }

    const wasDefault = address.isDefault;

    await address.destroy();

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

  async getAddressCount(userId: number): Promise<number> {
    return Address.count({ where: { userId } });
  }
}

export const addressService = new AddressService();
