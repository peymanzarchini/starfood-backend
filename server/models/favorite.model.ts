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
import { Product } from "./product.model.js";

/**
 * Favorite Model
 * Represents user's favorite/wishlisted products
 */
export class Favorite extends Model<InferAttributes<Favorite>, InferCreationAttributes<Favorite>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User["id"]>;
  declare productId: ForeignKey<Product["id"]>;
  declare readonly createdAt: CreationOptional<Date>;
}

Favorite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Favorite",
    tableName: "favorites",
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId"],
        name: "unique_user_favorite",
      },
      { fields: ["userId"] },
      { fields: ["productId"] },
    ],
  }
);
