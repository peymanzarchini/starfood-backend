import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "../config/database.js";

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare price: number;
  declare imageUrl: string;
  declare isAvailable: boolean;
  declare categoryId: number;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "Name is required" } },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notNull: { msg: "Description is required" } },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { notNull: { msg: "Price is required" } },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isUrl: { msg: "Invalid image URL" } },
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
  }
);
