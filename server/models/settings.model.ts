import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "../config/database.js";

/**
 * Settings Model
 * Stores application configuration as key-value pairs
 */
export class Settings extends Model<InferAttributes<Settings>, InferCreationAttributes<Settings>> {
  declare id: CreationOptional<number>;
  declare key: string;
  declare value: string;
  declare description: CreationOptional<string | null>;
}

Settings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        name: "unique_settings_key",
        msg: "Settings key must be unique",
      },
      validate: {
        notNull: { msg: "Settings key is required" },
        notEmpty: { msg: "Settings key cannot be empty" },
      },
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "Settings value is required" },
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Settings",
    tableName: "settings",
    timestamps: false,
    indexes: [{ fields: ["key"], unique: true }],
  }
);

/**
 * Predefined settings keys for type safety
 */
export const SettingsKeys = {
  RESTAURANT_NAME: "restaurant_name",
  OPENING_HOUR: "opening_hour",
  CLOSING_HOUR: "closing_hour",
  DELIVERY_FEE: "delivery_fee",
  MIN_ORDER_AMOUNT: "min_order_amount",
  FREE_DELIVERY_THRESHOLD: "free_delivery_threshold",
  DELIVERY_RADIUS_KM: "delivery_radius_km",
  IS_OPEN: "is_open",
  PHONE_NUMBER: "phone_number",
  ADDRESS: "address",
  TAX_PERCENTAGE: "tax_percentage",
} as const;

export type SettingsKey = (typeof SettingsKeys)[keyof typeof SettingsKeys];
