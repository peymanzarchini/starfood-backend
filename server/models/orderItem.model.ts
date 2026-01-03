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
import { Product } from "./product.model.js";
import { Order } from "./orders.model.js";

/**
 * OrderItem Model
 * Represents an individual item within an order
 * Stores snapshot of product data at time of order
 */
export class OrderItem extends Model<
  InferAttributes<OrderItem>,
  InferCreationAttributes<OrderItem>
> {
  declare id: CreationOptional<number>;
  declare productName: string;
  declare quantity: number;
  declare unitPrice: number;
  declare totalPrice: number;
  declare orderId: ForeignKey<Order["id"]>;
  declare productId: ForeignKey<Product["id"]>;
  declare readonly createdAt: CreationOptional<Date>;

  // Associations
  declare order?: NonAttribute<Order>;
  declare product?: NonAttribute<Product>;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: { msg: "Product name is required" },
        notEmpty: { msg: "Product name cannot be empty" },
      },
      comment: "Snapshot of product name at time of order",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Quantity must be an integer" },
        min: { args: [1], msg: "Quantity must be at least 1" },
      },
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Unit price must be a valid number" },
        min: { args: [0], msg: "Unit price cannot be negative" },
      },
      get() {
        const value = this.getDataValue("unitPrice");
        return value !== null ? Number(value) : 0;
      },
      comment: "Price per unit at time of order",
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Total price must be a valid number" },
        min: { args: [0], msg: "Total price cannot be negative" },
      },
      get() {
        const value = this.getDataValue("totalPrice");
        return value !== null ? Number(value) : 0;
      },
      comment: "quantity * unitPrice",
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "OrderItem",
    tableName: "order_items", // Fixed: was "order_item"
    updatedAt: false,
    indexes: [{ fields: ["orderId"] }, { fields: ["productId"] }],
  }
);
