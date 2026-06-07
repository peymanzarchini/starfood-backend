import { Router } from "express";
import { addressController } from "../controllers/address.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createAddressSchema,
  updateAddressSchema,
  getAddressByIdSchema,
} from "../validators/schemas/address.schema.js";

const router = Router();

router.use(authenticate);

router.get("/", addressController.getUserAddresses.bind(addressController));

router.get("/default", addressController.getDefaultAddress.bind(addressController));

router.get(
  "/:id",
  validate(getAddressByIdSchema),
  addressController.getAddressById.bind(addressController),
);

router.post(
  "/",
  validate(createAddressSchema),
  addressController.createAddress.bind(addressController),
);

router.put(
  "/:id",
  validate(updateAddressSchema),
  addressController.updateAddress.bind(addressController),
);

router.patch(
  "/:id/default",
  validate(getAddressByIdSchema),
  addressController.setDefaultAddress.bind(addressController),
);

router.delete(
  "/:id",
  validate(getAddressByIdSchema),
  addressController.deleteAddress.bind(addressController),
);

export default router;
