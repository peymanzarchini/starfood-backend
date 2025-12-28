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
 * Review Model
 * Represents customer reviews for products
 */
export class Review extends Model<InferAttributes<Review>, InferCreationAttributes<Review>> {
  declare id: CreationOptional<number>;
  declare rating: number;
  declare comment: CreationOptional<string | null>;
  declare isApproved: CreationOptional<boolean>;
  declare userId: ForeignKey<User["id"]>;
  declare productId: ForeignKey<Product["id"]>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: { msg: "Rating is required" },
        isInt: { msg: "Rating must be an integer" },
        min: { args: [1], msg: "Rating must be at least 1" },
        max: { args: [5], msg: "Rating cannot exceed 5" },
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true, // Fixed: changed to true
      validate: {
        len: {
          args: [0, 1000],
          msg: "Comment cannot exceed 1000 characters",
        },
      },
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Reviews need admin approval before being displayed",
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
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "reviews",
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId"],
        name: "unique_user_product_review",
      },
      { fields: ["isApproved"] },
      { fields: ["rating"] },
      { fields: ["productId"] },
    ],
  }
);
