import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "../config/database.js";

export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare imageUrl: string;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: "unique_category", msg: "This category has already been registered." },
      validate: {
        notNull: { msg: "Name is required" },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isUrl: { msg: "Invalid image URL" } },
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    timestamps: false,
  }
);
