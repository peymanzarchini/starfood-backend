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

export interface CategoryResponse {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  productCount?: number;
}

export interface ProductImageResponse {
  id: number;
  url: string;
  thumbnailUrl: string | null;
  altText: string | null;
  displayOrder: number;
}

export interface ProductListResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  finalPrice: number;
  discount: number;
  discountAmount: number;
  imageUrl: string;
  isAvailable: boolean;
  isPopular: boolean;
  preparationTime: number | null;
  calories: number | null;
  categoryId: number;
}

export interface ProductDetailResponse extends ProductListResponse {
  ingredients: string[];
  gallery: ProductImageResponse[];
  category: {
    id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CartProductInfo {
  id: number;
  name: string;
  price: number;
  finalPrice: number;
  discount: number;
  imageUrl: string;
  isAvailable: boolean;
}

export interface CartItemResponse {
  id: number;
  quantity: number;
  product: CartProductInfo;
  itemTotal: number;
}

export interface CartResponse {
  id: number | null;
  items: CartItemResponse[];
  itemCount: number;
  subtotal: number;
  totalDiscount: number;
  total: number;
}
