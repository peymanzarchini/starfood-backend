import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "@sequelize/core";
import { sequelize } from "../config/database.js";
import { User } from "./user.model.js";

/**
 * Address Model
 * Stores delivery addresses for users
 */
export class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare street: string;
  declare city: string;
  declare postalCode: CreationOptional<string | null>;
  declare phoneNumber: string;
  declare latitude: CreationOptional<number | null>;
  declare longitude: CreationOptional<number | null>;
  declare isDefault: CreationOptional<boolean>;
  declare userId: ForeignKey<User["id"]>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  // Associations
  declare user?: NonAttribute<User>;

  /**
   * Virtual field - Returns formatted full address
   */
  get fullAddress(): NonAttribute<string> {
    return `${this.street}, ${this.city}`;
  }
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: { msg: "Address title is required" },
        notEmpty: { msg: "Address title cannot be empty" },
        len: {
          args: [2, 50],
          msg: "Title must be between 2 and 50 characters",
        },
      },
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: { msg: "Street is required" },
        notEmpty: { msg: "Street cannot be empty" },
      },
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: { msg: "City is required" },
        notEmpty: { msg: "City cannot be empty" },
      },
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
          args: /^[a-zA-Z0-9\s\\-]{3,20}$/,
          msg: "Invalid postal code format",
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notNull: { msg: "Phone number is required" },
        is: {
          args: /^\+?[0-9\s\-()]{7,20}$/,
          msg: "Invalid phone number format",
        },
      },
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      validate: {
        min: { args: [-90], msg: "Latitude must be between -90 and 90" },
        max: { args: [90], msg: "Latitude must be between -90 and 90" },
      },
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      validate: {
        min: { args: [-180], msg: "Longitude must be between -180 and 180" },
        max: { args: [180], msg: "Longitude must be between -180 and 180" },
      },
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Address",
    tableName: "addresses",
    indexes: [{ fields: ["userId"] }, { fields: ["isDefault"] }, { fields: ["city"] }],
  }
);
