import swaggerJSDoc from "swagger-jsdoc";
import { commonSchemas } from "./schemas/common.schema.js";
import { authSchemas } from "./schemas/auth.schema.js";
import { cartSchema } from "./schemas/cart.schema.js";
import { categorySchema } from "./schemas/category.schema.js";
import { addressSchema } from "./schemas/address.schema.js";
import { ordersSchema } from "./schemas/orders.schema.js";
import { reviewSchema } from "./schemas/review.schema.js";
import { favoriteSchema } from "./schemas/favorite.schema.js";
import { authPaths } from "./paths/auth.paths.js";
import { productPaths } from "./paths/product.paths.js";
import { cartPaths } from "./paths/cart.paths.js";
import { categoryPaths } from "./paths/category.paths.js";
import { addressPaths } from "./paths/address.paths.js";
import { ordersPaths } from "./paths/orders.paths.js";
import { reviewPaths } from "./paths/review.paths.js";
import { favoritePaths } from "./paths/favorite.paths.js";
import { discountPaths } from "./paths/discount.paths.js";
import { categoryAdminPaths } from "./paths/admin/category.paths.js";
import { productAdminPaths } from "./paths/admin/product.paths.js";
import { ordersAdminPaths } from "./paths/admin/orders.paths.js";
import { reviewAdminPaths } from "./paths/admin/review.paths.js";
import { settingsAdminPaths } from "./paths/admin/settings.paths.js";
import { discountAdminPaths } from "./paths/admin/discount.paths.js";
import { env } from "../env.js";
import { productSchema } from "./schemas/product.schema.js";
import { discountSchema } from "./schemas/discount.schema.js";
import { userAdminPaths } from "./paths/admin/user.paths.js";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "StarFood API",
      version: "1.0.0",
      description: "Complete API documentation for StarFood Fast Food Application",
    },
    servers: [
      {
        url: `http://localhost:${env.port}/api`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter token without `Bearer` prefix, e.g. 'eyJhbGci...'",
        },
      },
      schemas: {
        ...commonSchemas,
        ...authSchemas,
        ...cartSchema,
        ...categorySchema,
        ...addressSchema,
        ...ordersSchema,
        ...reviewSchema,
        ...favoriteSchema,
        ...productSchema,
        ...discountSchema,
      },
    },
    paths: {
      ...authPaths,
      ...productPaths,
      ...cartPaths,
      ...categoryPaths,
      ...addressPaths,
      ...ordersPaths,
      ...reviewPaths,
      ...favoritePaths,
      ...discountPaths,

      // =====================
      // Admin Routes
      // =====================
      ...categoryAdminPaths,
      ...productAdminPaths,
      ...ordersAdminPaths,
      ...reviewAdminPaths,
      ...settingsAdminPaths,
      ...discountAdminPaths,
      ...userAdminPaths,
    },
  },
  apis: [], // Empty because we define paths manually above
};

export const swaggerSpec = swaggerJSDoc(options);
