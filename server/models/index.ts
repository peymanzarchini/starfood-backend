import { sequelize } from "../config/database.js";
import { User } from "./user.model.js";
import { Address } from "./address.model.js";
import { Category } from "./category.model.js";
import { Discount } from "./discount.model.js";
import { Order } from "./orders.model.js";
import { OrderItem } from "./orderItem.model.js";
import { Product } from "./product.model.js";
import { Review } from "./review.model.js";

const models = {
  User,
  Address,
  Category,
  Discount,
  Order,
  OrderItem,
  Product,
  Review,
};

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

User.hasMany(Address, { foreignKey: "userId" });
Address.belongsTo(User, { foreignKey: "userId" });

Order.belongsTo(Address, { foreignKey: "addressId" });

User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Review, { foreignKey: "productId" });
Review.belongsTo(Product, { foreignKey: "productId" });

Discount.hasMany(Order, { foreignKey: "discountId" });
Order.belongsTo(Discount, { foreignKey: "discountId" });

export { sequelize, models };
