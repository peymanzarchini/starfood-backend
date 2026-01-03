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

/**
 * All address routes require authentication
 */
router.use(authenticate);

/**
 * @route   GET /api/addresses
 * @desc    Get all addresses for current user
 * @access  Private
 */
router.get("/", addressController.getUserAddresses.bind(addressController));

/**
 * @route   GET /api/addresses/default
 * @desc    Get default address
 * @access  Private
 */
router.get("/default", addressController.getDefaultAddress.bind(addressController));

/**
 * @route   GET /api/addresses/:id
 * @desc    Get address by ID
 * @access  Private
 */
router.get(
  "/:id",
  validate(getAddressByIdSchema),
  addressController.getAddressById.bind(addressController)
);

/**
 * @route   POST /api/addresses
 * @desc    Create new address
 * @access  Private
 */
router.post(
  "/",
  validate(createAddressSchema),
  addressController.createAddress.bind(addressController)
);

/**
 * @route   PUT /api/addresses/:id
 * @desc    Update address
 * @access  Private
 */
router.put(
  "/:id",
  validate(updateAddressSchema),
  addressController.updateAddress.bind(addressController)
);

/**
 * @route   PATCH /api/addresses/:id/default
 * @desc    Set address as default
 * @access  Private
 */
router.patch(
  "/:id/default",
  validate(getAddressByIdSchema),
  addressController.setDefaultAddress.bind(addressController)
);

/**
 * @route   DELETE /api/addresses/:id
 * @desc    Delete address
 * @access  Private
 */
router.delete(
  "/:id",
  validate(getAddressByIdSchema),
  addressController.deleteAddress.bind(addressController)
);

export default router;
