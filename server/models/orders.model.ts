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
import { User } from "./user.model.js";
import { Address } from "./address.model.js";
import { Discount } from "./discount.model.js";
import { OrderItem } from "./orderItem.model.js";

/**
 * Order status types
 */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered"
  | "cancelled";

/**
 * Order Model
 * Represents a customer's order
 */
export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<number>;
  declare orderNumber: CreationOptional<string>;
  declare subtotal: number;
  declare discountAmount: CreationOptional<number>;
  declare deliveryCost: number;
  declare totalAmount: number;
  declare status: CreationOptional<OrderStatus>;
  declare notes: CreationOptional<string | null>;
  declare estimatedDelivery: CreationOptional<Date | null>;
  declare userId: ForeignKey<User["id"]>;
  declare addressId: ForeignKey<Address["id"]>;
  declare discountId: CreationOptional<ForeignKey<Discount["id"]> | null>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  // Associations
  declare user?: NonAttribute<User>;
  declare address?: NonAttribute<Address>;
  declare discount?: NonAttribute<Discount>;
  declare items?: NonAttribute<OrderItem[]>;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        name: "unique_order_number",
        msg: "Order number must be unique",
      },
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Subtotal must be a valid number" },
        min: { args: [0], msg: "Subtotal cannot be negative" },
      },
      get() {
        const value = this.getDataValue("subtotal");
        return value !== null ? Number(value) : 0;
      },
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: { msg: "Discount amount must be a valid number" },
        min: { args: [0], msg: "Discount amount cannot be negative" },
      },
      get() {
        const value = this.getDataValue("discountAmount");
        return value !== null ? Number(value) : 0;
      },
    },
    deliveryCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Delivery cost must be a valid number" },
        min: { args: [0], msg: "Delivery cost cannot be negative" },
      },
      get() {
        const value = this.getDataValue("deliveryCost");
        return value !== null ? Number(value) : 0;
      },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Total amount must be a valid number" },
        min: { args: [0], msg: "Total amount cannot be negative" },
      },
      get() {
        const value = this.getDataValue("totalAmount");
        return value !== null ? Number(value) : 0;
      },
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivering",
        "delivered",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "Notes cannot exceed 500 characters",
        },
      },
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discountId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    hooks: {
      /**
       * Generate unique order number before creating order
       * Format: ORD-YYYYMMDD-XXXX (e.g., ORD-20240115-0001)
       */
      beforeCreate: async (order: Order) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
        order.orderNumber = `ORD-${year}${month}${day}-${random}`;
      },
    },
    indexes: [
      { fields: ["userId"] },
      { fields: ["status"] },
      { fields: ["createdAt"] },
      { fields: ["orderNumber"], unique: true },
      { fields: ["addressId"] },
    ],
  }
);
