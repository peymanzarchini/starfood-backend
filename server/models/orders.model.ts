import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "../config/database.js";

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<number>;
  declare totalAmount: number;
  declare deliveryCost: number;
  declare status: "pending" | "preparing" | "delivering" | "completed" | "cancelled";
  declare userId: number;
  declare addressId: number;
  declare discountId: number | null;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deliveryCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "preparing", "delivering", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
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
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
  }
);
