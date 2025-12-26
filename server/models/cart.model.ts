import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "../config/database.js";
import { User } from "./user.model.js";

/**
 * Cart Model
 * Represents a user's shopping cart
 * Each user can have only one cart (one-to-one relationship)
 */
export class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User["id"]>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: {
        name: "unique_user_cart",
        msg: "User already has a cart",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Cart",
    tableName: "carts",
    indexes: [{ fields: ["userId"], unique: true }],
  }
);
