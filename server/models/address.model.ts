import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "../config/database.js";

export class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare street: string;
  declare city: string;
  declare postalCode: string;
  declare phoneNumber: string;
  declare userId: number;
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "Title is required" } },
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "Street is required" } },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "City is required" } },
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^[a-zA-Z0-9\s\\-]{3,20}$/,
          msg: "Invalid postal code format.",
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Phone number is required" },
        is: {
          args: /^\+?[0-9\s\-\\(\\)]{7,15}$/,
          msg: "Invalid international phone number format.",
        },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Address",
    tableName: "addresses",
  }
);
