import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import bcrypt from "bcrypt";
import { sequelize } from "../config/database.js";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare phoneNumber: string;
  declare role: "admin" | "customer";

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
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        notNull: { msg: "firstName is required" },
        len: { args: [3, 40], msg: "firstName must be between 3 and 40 characters" },
      },
    },
    lastName: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        notNull: { msg: "lastName is required" },
        len: { args: [5, 40], msg: "lastName must be between 5 and 40 characters" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: "unique_email", msg: "This email is already registered" },
      validate: { isEmail: { msg: "Invalid email" } },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Password is required" },
        len: { args: [8, 255], msg: "Password must be at least 8 characters" },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: "unique_phone_number", msg: "This phone number is already registered" },
      validate: {
        notNull: { msg: "Phone number is required" },
        is: {
          args: /^\+?[0-9\s\-\\(\\)]{7,15}$/,
          msg: "Invalid international phone number format.",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "customer"),
      allowNull: false,
      defaultValue: "customer",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",

    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: { attributes: { include: ["password"] } },
    },
    hooks: {
      beforeCreate: async (user: User) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);
