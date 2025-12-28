import { User } from "../models/index.js";
import { LoginResponse, UserResponse } from "../types/index.js";
import { formatUserResponse } from "../utils/formatUserResponse.js";
import { HttpError } from "../utils/httpError.js";
import {
  verifyRefreshToken,
  TokenPair,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.js";
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
    const user = await User.withScope("password").findOne({
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
      throw HttpError.unauthorized("Invalid email or password");
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
    const user = await User.withScope("password").findByPk(userId, {
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
}

export const authService = new AuthService();
