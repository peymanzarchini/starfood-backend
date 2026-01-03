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

export interface AddressResponse {
  id: number;
  title: string;
  street: string;
  city: string;
  postalCode: string | null;
  phoneNumber: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
  fullAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderAddressResponse {
  id: number;
  title: string;
  street: string;
  city: string;
  phoneNumber: string;
  fullAddress: string;
}

export interface OrderListResponse {
  id: number;
  orderNumber: string;
  status: string;
  itemCount: number;
  totalAmount: number;
  createdAt: Date;
}

export interface OrderDetailResponse {
  id: number;
  orderNumber: string;
  status: string;
  subtotal: number;
  discountAmount: number;
  deliveryCost: number;
  totalAmount: number;
  notes: string | null;
  estimatedDelivery: Date | null;
  items: OrderItemResponse[];
  address: OrderAddressResponse;
  discountCode: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderAdminResponse extends OrderDetailResponse {
  user: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
}

export interface ReviewUserInfo {
  id: number;
  firstName: string;
  lastName: string;
}

export interface ReviewProductInfo {
  id: number;
  name: string;
  imageUrl: string;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  user: ReviewUserInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewWithProductResponse extends ReviewResponse {
  product: ReviewProductInfo;
}

export interface ReviewAdminResponse extends ReviewWithProductResponse {
  user: ReviewUserInfo & { email: string };
}

export interface ProductReviewsResponse {
  reviews: ReviewResponse[];
  stats: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
}
