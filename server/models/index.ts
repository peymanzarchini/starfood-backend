import { sequelize } from "../config/database.js";
import { User } from "./user.model.js";
import { Address } from "./address.model.js";
import { Category } from "./category.model.js";
import { Discount } from "./discount.model.js";
import { Order } from "./orders.model.js";
import { OrderItem } from "./orderItem.model.js";
import { Product } from "./product.model.js";
import { Review } from "./review.model.js";
import { Cart } from "./cart.model.js";
import { CartItem } from "./cartItem.model.js";
import { Favorite } from "./favorite.model.js";
import { Settings } from "./settings.model.js";

/**
 * All models exported as a single object
 */
const models = {
  User,
  Address,
  Category,
  Discount,
  Order,
  OrderItem,
  Product,
  Review,
  Cart,
  CartItem,
  Favorite,
  Settings,
};

// ============================================================
// USER RELATIONS
// ============================================================

// User has many Orders (one-to-many)
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

// User has many Addresses (one-to-many)
User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId", as: "user" });

// User has many Reviews (one-to-many)
User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

// User has one Cart (one-to-one)
User.hasOne(Cart, { foreignKey: "userId", as: "cart" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

// User has many Favorites (one-to-many)
User.hasMany(Favorite, { foreignKey: "userId", as: "favorites" });
Favorite.belongsTo(User, { foreignKey: "userId", as: "user" });

// ============================================================
// ORDER RELATIONS
// ============================================================

// Order has many OrderItems (one-to-many)
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Order belongs to Address (many-to-one)
Order.belongsTo(Address, { foreignKey: "addressId", as: "address" });
Address.hasMany(Order, { foreignKey: "addressId", as: "orders" });

// Order belongs to Discount (many-to-one, optional)
Order.belongsTo(Discount, { foreignKey: "discountId", as: "discount" });
Discount.hasMany(Order, { foreignKey: "discountId", as: "orders" });

// ============================================================
// PRODUCT RELATIONS
// ============================================================

// Category has many Products (one-to-many)
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Product has many OrderItems (one-to-many)
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Product has many Reviews (one-to-many)
Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Product has many Favorites (one-to-many)
Product.hasMany(Favorite, { foreignKey: "productId", as: "favorites" });
Favorite.belongsTo(Product, { foreignKey: "productId", as: "product" });

// ============================================================
// CART RELATIONS
// ============================================================

// Cart has many CartItems (one-to-many)
Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

// CartItem belongs to Product (many-to-one)
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });
Product.hasMany(CartItem, { foreignKey: "productId", as: "cartItems" });

// ============================================================
// EXPORTS
// ============================================================

export { sequelize, models };
export {
  User,
  Address,
  Category,
  Discount,
  Order,
  OrderItem,
  Product,
  Review,
  Cart,
  CartItem,
  Favorite,
  Settings,
};
