import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "@sequelize/core";
import bcrypt from "bcrypt";
import { sequelize } from "../config/database.js";

/**
 * User Model
 * Represents application users (customers and admins)
 */
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare phoneNumber: string;
  declare role: CreationOptional<"admin" | "customer">;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  /**
   * Virtual field - Returns user's full name
   */
  get fullName(): NonAttribute<string> {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Validates password against stored hash
   * @param password - Plain text password to validate
   */
  async validPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: { msg: "First name is required" },
        notEmpty: { msg: "First name cannot be empty" },
        len: {
          args: [2, 50],
          msg: "First name must be between 2 and 50 characters",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: { msg: "Last name is required" },
        notEmpty: { msg: "Last name cannot be empty" },
        len: {
          args: [2, 50], // Fixed: was 5, now 2
          msg: "Last name must be between 2 and 50 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_email",
        msg: "This email is already registered",
      },
      validate: {
        notNull: { msg: "Email is required" },
        isEmail: { msg: "Invalid email format" },
      },
      set(value: string) {
        this.setDataValue("email", value.toLowerCase().trim());
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Password is required" },
        len: {
          args: [8, 255],
          msg: "Password must be at least 8 characters",
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        name: "unique_phone_number",
        msg: "This phone number is already registered",
      },
      validate: {
        notNull: { msg: "Phone number is required" },
        is: {
          args: /^\+?[0-9\s\-()]{7,20}$/,
          msg: "Invalid phone number format",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "customer"),
      allowNull: false,
      defaultValue: "customer",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    // Default scope excludes password from queries
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    // Named scope to include password when needed
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
    hooks: {
      // Hash password before creating user
      beforeCreate: async (user: User) => {
        user.password = await bcrypt.hash(user.password, 12);
      },
      // Hash password before updating if changed
      beforeUpdate: async (user: User) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
    indexes: [
      { fields: ["email"], unique: true },
      { fields: ["phoneNumber"], unique: true },
      { fields: ["role"] },
    ],
  }
);
