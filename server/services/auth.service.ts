import { Op } from "@sequelize/core";
import { User } from "../models/index.js";
import { LoginResponse, UserResponse } from "../types/index.js";
import { formatUserResponse } from "../utils/format-response/formatUserResponse.js";
import { HttpError } from "../utils/httpError.js";
import {
  verifyRefreshToken,
  TokenPair,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.js";
import { getOffset, PaginationOptions } from "../utils/pagination.js";
import {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  UpdateProfileInput,
} from "../validators/schemas/auth.schema.js";

class AuthService {
  async register(data: RegisterInput): Promise<UserResponse> {
    const existingEmail = await User.findOne({
      where: { email: data.email.toLocaleLowerCase() },
    });

    if (existingEmail) {
      throw HttpError.conflict("Email is already registered");
    }

    const existingPhone = await User.findOne({
      where: { phoneNumber: data.phoneNumber },
    });

    if (existingPhone) {
      throw HttpError.conflict("Phone number is already registered");
    }

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLocaleLowerCase(),
      password: data.password,
      phoneNumber: data.phoneNumber,
    });

    return formatUserResponse(user);
  }

  async login(data: LoginInput): Promise<LoginResponse> {
    const user = await User.withScope("withPassword").findOne({
      where: { email: data.email.toLocaleLowerCase() },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "role",
        "password",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) {
      throw HttpError.notFound("User not found");
    }

    if (user.status === "banned") {
      throw HttpError.forbidden("Your account has been suspended. Please contact support.");
    }

    const isPasswordValid = await user.validPassword(data.password);

    if (!isPasswordValid) {
      throw HttpError.unauthorized("Invalid email or password");
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
      user: formatUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findByPk(decoded.id);
      if (!user) {
        throw HttpError.unauthorized("User not found");
      }
      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      return {
        accessToken: generateAccessToken(tokenPayload),
        refreshToken: generateRefreshToken(tokenPayload),
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw HttpError.unauthorized("Invalid or expired refresh token");
    }
  }

  async getProfile(userId: number): Promise<UserResponse> {
    const user = await User.findByPk(userId);

    if (!user) {
      throw HttpError.notFound("User not found");
    }

    return formatUserResponse(user);
  }

  async updateProfile(userId: number, data: UpdateProfileInput): Promise<UserResponse> {
    const user = await User.findByPk(userId);

    if (!user) {
      throw HttpError.notFound("User not found");
    }

    if (data.phoneNumber && data.phoneNumber !== user.phoneNumber) {
      const existingPhone = await User.findOne({
        where: { phoneNumber: data.phoneNumber },
      });
      if (existingPhone) {
        throw HttpError.conflict("Phone number is already in use");
      }
    }

    await user.update({
      firstName: data.firstName ?? user.firstName,
      lastName: data.lastName ?? user.lastName,
      phoneNumber: data.phoneNumber ?? user.phoneNumber,
    });

    return formatUserResponse(user);
  }

  async changePassword(userId: number, data: ChangePasswordInput): Promise<void> {
    const user = await User.withScope("withPassword").findByPk(userId, {
      attributes: ["id", "password"],
    });

    if (!user) {
      throw HttpError.notFound("User not found");
    }

    const isPasswordValid = await user.validPassword(data.currentPassword);

    if (!isPasswordValid) {
      throw HttpError.badRequest("Current password is incorrect");
    }

    const isSamePassword = await user.validPassword(data.newPassword);

    if (isSamePassword) {
      throw HttpError.badRequest("New password must be different from current password");
    }

    await user.update({ password: data.newPassword });
  }

  //admin

  async getAllUsers(
    pagination: PaginationOptions,
    filters?: { search?: string; role?: "admin" | "customer"; status?: "active" | "banned" },
  ): Promise<{ items: UserResponse[]; totalItems: number }> {
    const { page, limit } = pagination;
    const offset = getOffset(page, limit);

    const where: Record<string | symbol, unknown> = {};

    if (filters?.role) where.role = filters.role;
    if (filters?.status) where.status = filters.status;
    if (filters?.search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${filters.search}%` } },
        { lastName: { [Op.like]: `%${filters.search}%` } },
        { email: { [Op.like]: `%${filters.search}%` } },
        { phoneNumber: { [Op.like]: `%${filters.search}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return { items: rows.map(formatUserResponse), totalItems: count };
  }

  async getUserById(id: number): Promise<UserResponse> {
    const user = await User.findByPk(id);
    if (!user) throw HttpError.notFound("User not found");
    return formatUserResponse(user);
  }

  async updateUserRole(id: number, role: "admin" | "customer"): Promise<UserResponse> {
    const user = await User.findByPk(id);
    if (!user) throw HttpError.notFound("User not found");

    if (user.role === "admin" && role === "customer") {
      const adminCount = await User.count({ where: { role: "admin" } });
      if (adminCount <= 1) {
        throw HttpError.badRequest("Cannot demote the last remaining admin");
      }
    }

    await user.update({ role });
    return formatUserResponse(user);
  }

  async toggleUserStatus(id: number): Promise<UserResponse> {
    const user = await User.findByPk(id);
    if (!user) throw HttpError.notFound("User not found");
    if (user.role === "admin") {
      throw HttpError.badRequest("Admin accounts cannot be banned");
    }

    const newStatus = user.status === "active" ? "banned" : "active";
    await user.update({ status: newStatus });
    return formatUserResponse(user);
  }
}

export const authService = new AuthService();
