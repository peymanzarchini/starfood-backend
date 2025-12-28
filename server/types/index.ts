export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: "admin" | "customer";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
