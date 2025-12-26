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
import { Category } from "./category.model.js";

/**
 * Product Model
 * Represents food items available for order
 */
export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare price: number;
  declare imageUrl: string;
  declare isAvailable: CreationOptional<boolean>;
  declare ingredients: CreationOptional<string[]>;
  declare preparationTime: CreationOptional<number | null>;
  declare calories: CreationOptional<number | null>;
  declare isPopular: CreationOptional<boolean>;
  declare discount: CreationOptional<number>;
  declare categoryId: ForeignKey<Category["id"]>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  /**
   * Virtual field - Returns price after discount
   */
  get finalPrice(): NonAttribute<number> {
    if (this.discount && this.discount > 0) {
      return Math.round(this.price * (1 - this.discount / 100));
    }
    return this.price;
  }

  /**
   * Virtual field - Returns discount amount in currency
   */
  get discountAmount(): NonAttribute<number> {
    if (this.discount && this.discount > 0) {
      return Math.round(this.price * (this.discount / 100));
    }
    return 0;
  }
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: { msg: "Product name is required" },
        notEmpty: { msg: "Product name cannot be empty" },
        len: {
          args: [2, 100],
          msg: "Product name must be between 2 and 100 characters",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "Description is required" },
        notEmpty: { msg: "Description cannot be empty" },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "Price is required" },
        isDecimal: { msg: "Price must be a valid number" },
        min: { args: [0], msg: "Price cannot be negative" },
      },
      get() {
        const value = this.getDataValue("price");
        return value !== null ? Number(value) : 0;
      },
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notNull: { msg: "Image URL is required" },
        isUrl: { msg: "Invalid image URL format" },
      },
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    ingredients: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "List of ingredients as JSON array",
    },
    preparationTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: { msg: "Preparation time must be an integer" },
        min: { args: [1], msg: "Preparation time must be at least 1 minute" },
      },
      comment: "Preparation time in minutes",
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: { msg: "Calories must be an integer" },
        min: { args: [0], msg: "Calories cannot be negative" },
      },
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: "Discount must be an integer" },
        min: { args: [0], msg: "Discount cannot be less than 0%" },
        max: { args: [100], msg: "Discount cannot exceed 100%" },
      },
      comment: "Discount percentage (0-100)",
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    indexes: [
      { fields: ["categoryId"] },
      { fields: ["isAvailable"] },
      { fields: ["isPopular"] },
      { fields: ["price"] },
      { fields: ["name"] },
    ],
  }
);
