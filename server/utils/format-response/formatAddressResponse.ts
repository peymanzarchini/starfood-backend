import { Address } from "../../models/address.model.js";
import { AddressResponse } from "../../types/index.js";

export function formatAddressResponse(address: Address): AddressResponse {
  return {
    id: address.id,
    title: address.title,
    street: address.street,
    city: address.city,
    postalCode: address.postalCode,
    phoneNumber: address.phoneNumber,
    latitude: address.latitude ? Number(address.latitude) : null,
    longitude: address.longitude ? Number(address.longitude) : null,
    isDefault: address.isDefault,
    fullAddress: `${address.street}, ${address.city}`,
    createdAt: address.createdAt!,
    updatedAt: address.updatedAt!,
  };
}
