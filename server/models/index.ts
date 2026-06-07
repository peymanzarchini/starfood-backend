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
import { ProductImage } from "./productImage.model.js";

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
  ProductImage,
};

User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasOne(Cart, { foreignKey: "userId", as: "cart" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Favorite, { foreignKey: "userId", as: "favorites" });
Favorite.belongsTo(User, { foreignKey: "userId", as: "user" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

Order.belongsTo(Address, { foreignKey: "addressId", as: "address" });
Address.hasMany(Order, { foreignKey: "addressId", as: "orders" });

Order.belongsTo(Discount, { foreignKey: "discountId", as: "discount" });
Discount.hasMany(Order, { foreignKey: "discountId", as: "orders" });

Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

Product.hasMany(ProductImage, { foreignKey: "productId", as: "images" });
ProductImage.belongsTo(Product, { foreignKey: "productId", as: "product" });

Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "productId", as: "product" });

Product.hasMany(Favorite, { foreignKey: "productId", as: "favorites" });
Favorite.belongsTo(Product, { foreignKey: "productId", as: "product" });

Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });
Product.hasMany(CartItem, { foreignKey: "productId", as: "cartItems" });

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
  ProductImage,
};
