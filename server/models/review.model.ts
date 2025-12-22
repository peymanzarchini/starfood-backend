import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "../config/database.js";

export class Review extends Model<InferAttributes<Review>, InferCreationAttributes<Review>> {
  declare id: CreationOptional<number>;
  declare rating: number;
  declare comment: string;
  declare userId: number;
  declare productId: number;
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
      validate: { min: 1, max: 5 },
    },
    comment: { type: DataTypes.TEXT, allowNull: false },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "reviews",
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId"],
      },
    ],
  }
);
