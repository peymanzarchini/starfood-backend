import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "@sequelize/core";
import { sequelize } from "../config/database.js";
import { Cart } from "./cart.model.js";
import { Product } from "./product.model.js";

/**
 * CartItem Model
 * Represents an item in a user's shopping cart
 */
export class CartItem extends Model<InferAttributes<CartItem>, InferCreationAttributes<CartItem>> {
  declare id: CreationOptional<number>;
  declare quantity: CreationOptional<number>;
  declare cartId: ForeignKey<Cart["id"]>;
  declare productId: ForeignKey<Product["id"]>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  // Associations
  declare cart?: NonAttribute<Cart>;
  declare product?: NonAttribute<Product>;
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: { msg: "Quantity must be an integer" },
        min: { args: [1], msg: "Quantity must be at least 1" },
        max: { args: [99], msg: "Quantity cannot exceed 99" },
      },
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "CartItem",
    tableName: "cart_items",
    indexes: [
      {
        unique: true,
        fields: ["cartId", "productId"],
        name: "unique_cart_product",
      },
      { fields: ["cartId"] },
      { fields: ["productId"] },
    ],
  }
);
