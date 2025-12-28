import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "../config/database.js";

export type DiscountType = "percentage" | "fixed";

export class Discount extends Model<InferAttributes<Discount>, InferCreationAttributes<Discount>> {
  declare id: CreationOptional<number>;
  declare code: string;
  declare type: CreationOptional<DiscountType>;
  declare value: number;
  declare minOrderAmount: CreationOptional<number>;
  declare maxDiscountAmount: CreationOptional<number | null>;
  declare usageLimit: CreationOptional<number>;
  declare usedCount: CreationOptional<number>;
  declare startDate: CreationOptional<Date>;
  declare expireDate: Date;
  declare isActive: CreationOptional<boolean>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  isValid(): boolean {
    const now = new Date();
    return (
      this.isActive &&
      this.startDate <= now &&
      this.expireDate > now &&
      this.usedCount < this.usageLimit
    );
  }

  calculateDiscount(orderAmount: number): number {
    if (orderAmount < this.minOrderAmount) {
      return 0;
    }

    let discount: number;

    if (this.type === "percentage") {
      discount = Math.round(orderAmount * (this.value / 100));
    } else {
      discount = this.value;
    }

    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }

    return discount;
  }
}

function isAfterStartValidator(this: Discount, value: Date) {
  if (this.startDate && value <= this.startDate) {
    throw new Error("Expire date must be after start date");
  }
}

Discount.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        name: "unique_discount_code",
        msg: "Discount code already exists",
      },
      validate: {
        notNull: { msg: "Discount code is required" },
        notEmpty: { msg: "Discount code cannot be empty" },
        len: {
          args: [3, 50],
          msg: "Discount code must be between 3 and 50 characters",
        },
      },
      set(value: string) {
        this.setDataValue("code", value.toUpperCase().trim());
      },
    },
    type: {
      type: DataTypes.ENUM("percentage", "fixed"),
      allowNull: false,
      defaultValue: "percentage",
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "Discount value is required" },
        isDecimal: { msg: "Discount value must be a valid number" },
        min: { args: [0.01], msg: "Discount value must be greater than 0" },
      },
      get() {
        const value = this.getDataValue("value");
        return value !== null ? Number(value) : 0;
      },
    },
    minOrderAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: { msg: "Minimum order amount must be a valid number" },
        min: { args: [0], msg: "Minimum order amount cannot be negative" },
      },
      get() {
        const value = this.getDataValue("minOrderAmount");
        return value !== null ? Number(value) : 0;
      },
    },
    maxDiscountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        isDecimal: { msg: "Maximum discount amount must be a valid number" },
        min: { args: [0], msg: "Maximum discount amount cannot be negative" },
      },
      get() {
        const value = this.getDataValue("maxDiscountAmount");
        return value !== null ? Number(value) : null;
      },
    },
    usageLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: { msg: "Usage limit must be an integer" },
        min: { args: [1], msg: "Usage limit must be at least 1" },
      },
    },
    usedCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: "Used count must be an integer" },
        min: { args: [0], msg: "Used count cannot be negative" },
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expireDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "Expire date is required" },
        isAfterStart: isAfterStartValidator,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Discount",
    tableName: "discounts",
    indexes: [
      { fields: ["code"], unique: true },
      { fields: ["isActive"] },
      { fields: ["expireDate"] },
      { fields: ["startDate"] },
    ],
  }
);
