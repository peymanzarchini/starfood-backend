import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "../config/database.js";
import { Product } from "./product.model.js";

/**
 * ProductImage Model
 * Stores gallery images for product detail page (lightbox)
 * Note: Main product image is stored in Product.imageUrl
 */
export class ProductImage extends Model<
  InferAttributes<ProductImage>,
  InferCreationAttributes<ProductImage>
> {
  declare id: CreationOptional<number>;
  declare url: string;
  declare thumbnailUrl: CreationOptional<string | null>;
  declare altText: CreationOptional<string | null>;
  declare displayOrder: CreationOptional<number>;
  declare productId: ForeignKey<Product["id"]>;
  declare readonly createdAt: CreationOptional<Date>;
}

ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notNull: { msg: "Image URL is required" },
        isUrl: { msg: "Invalid image URL format" },
      },
      comment: "Full-size image URL for lightbox",
    },
    thumbnailUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: { msg: "Invalid thumbnail URL format" },
      },
      comment: "Small thumbnail for gallery preview",
    },
    altText: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Alt text for accessibility and SEO",
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: "Display order must be an integer" },
        min: { args: [0], msg: "Display order cannot be negative" },
      },
      comment: "Order in gallery (0 = first)",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "ProductImage",
    tableName: "product_images",
    timestamps: true,
    updatedAt: false,
    indexes: [{ fields: ["productId"] }, { fields: ["displayOrder"] }],
  }
);
