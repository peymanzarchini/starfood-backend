import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "../config/database.js";

export class Discount extends Model<InferAttributes<Discount>, InferCreationAttributes<Discount>> {
  declare id: CreationOptional<number>;
  declare code: string;
  declare percentage: number;
  declare expireDate: Date;
  declare usageLimit: number;
  declare usedCount: number;
}

Discount.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expireDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    usageLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    usedCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Discount",
    tableName: "discounts",
  }
);
