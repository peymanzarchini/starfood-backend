import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "../config/database.js";

/**
 * Category Model
 * Represents product categories (e.g., Burgers, Pizzas, Drinks)
 */
export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: CreationOptional<string | null>;
  declare imageUrl: CreationOptional<string | null>;
  declare displayOrder: CreationOptional<number>;
  declare isActive: CreationOptional<boolean>;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        name: "unique_category_name",
        msg: "This category name already exists",
      },
      validate: {
        notNull: { msg: "Category name is required" },
        notEmpty: { msg: "Category name cannot be empty" },
        len: {
          args: [2, 50],
          msg: "Category name must be between 2 and 50 characters",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: { msg: "Invalid image URL format" },
      },
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: "Display order must be an integer" },
        min: { args: [0], msg: "Display order cannot be negative" },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    timestamps: false,
    indexes: [
      { fields: ["displayOrder"] },
      { fields: ["isActive"] },
      { fields: ["name"], unique: true },
    ],
  }
);
