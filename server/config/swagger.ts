import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.js";

const options: swaggerJsdoc.Options = {
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
          description: "Enter token with `Bearer` prefix, e.g. 'Bearer eyJhbGci...'",
        },
      },
      schemas: {
        // =====================
        // Global Response Types
        // =====================
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            body: { type: "object" },
            status: { type: "integer", example: 200 },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            body: { type: "object" },
            status: { type: "number", example: 400 },
          },
        },
        PaginationMeta: {
          type: "object",
          properties: {
            currentPage: { type: "integer" },
            totalPages: { type: "integer" },
            totalItems: { type: "integer" },
            itemsPerPage: { type: "integer" },
            hasNextPage: { type: "boolean" },
            hasPrevPage: { type: "boolean" },
          },
        },

        // =====================
        // Auth Schemas
        // =====================
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            phoneNumber: { type: "string" },
            role: { type: "string", enum: ["admin", "customer"] },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password" },
          },
        },
        RegisterInput: {
          type: "object",
          required: ["firstName", "lastName", "email", "password", "phoneNumber"],
          properties: {
            firstName: { type: "string", minLength: 2, maxLength: 50 },
            lastName: { type: "string", minLength: 2, maxLength: 50 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
            phoneNumber: { type: "string" },
          },
        },
        UpdateProfileInput: {
          type: "object",
          properties: {
            firstName: { type: "string", minLength: 2, maxLength: 50 },
            lastName: { type: "string", minLength: 2, maxLength: 50 },
            phoneNumber: { type: "string" },
          },
        },
        ChangePasswordInput: {
          type: "object",
          required: ["currentPassword", "newPassword", "confirmPassword"],
          properties: {
            currentPassword: { type: "string" },
            newPassword: { type: "string", minLength: 8 },
            confirmPassword: { type: "string" },
          },
        },

        // =====================
        // Product Schemas
        // =====================
        Product: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            finalPrice: { type: "number" },
            discount: { type: "number" },
            discountAmount: { type: "number" },
            imageUrl: { type: "string", format: "uri" },
            isAvailable: { type: "boolean" },
            isPopular: { type: "boolean" },
            categoryId: { type: "integer" },
            ingredients: { type: "array", items: { type: "string" } },
            preparationTime: { type: "integer", nullable: true },
            calories: { type: "integer", nullable: true },
          },
        },
        ProductDetail: {
          allOf: [
            { $ref: "#/components/schemas/Product" },
            {
              type: "object",
              properties: {
                gallery: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      url: { type: "string" },
                      thumbnailUrl: { type: "string" },
                      altText: { type: "string" },
                      displayOrder: { type: "integer" },
                    },
                  },
                },
                category: {
                  type: "object",
                  properties: { id: { type: "integer" }, name: { type: "string" } },
                },
              },
            },
          ],
        },
        CreateProductInput: {
          type: "object",
          required: ["name", "description", "price", "categoryId"],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            categoryId: { type: "integer" },
            imageUrl: { type: "string" },
            ingredients: { type: "array", items: { type: "string" } },
            preparationTime: { type: "integer" },
            calories: { type: "integer" },
            discount: { type: "integer", minimum: 0, maximum: 100 },
            isAvailable: { type: "boolean" },
            isPopular: { type: "boolean" },
          },
        },
        UpdateProductInput: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            categoryId: { type: "integer" },
            imageUrl: { type: "string" },
            ingredients: { type: "array", items: { type: "string" } },
            preparationTime: { type: "integer" },
            calories: { type: "integer" },
            discount: { type: "integer", minimum: 0, maximum: 100 },
            isAvailable: { type: "boolean" },
            isPopular: { type: "boolean" },
          },
        },

        // =====================
        // Category Schemas
        // =====================
        Category: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
            imageUrl: { type: "string", nullable: true },
            displayOrder: { type: "integer" },
            isActive: { type: "boolean" },
            productCount: { type: "integer" },
          },
        },
        CreateCategoryInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            imageUrl: { type: "string" },
            displayOrder: { type: "integer" },
            isActive: { type: "boolean" },
          },
        },
        UpdateCategoryInput: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            imageUrl: { type: "string" },
            displayOrder: { type: "integer" },
            isActive: { type: "boolean" },
          },
        },

        // =====================
        // Address Schemas
        // =====================
        Address: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            street: { type: "string" },
            city: { type: "string" },
            postalCode: { type: "string", nullable: true },
            phoneNumber: { type: "string" },
            latitude: { type: "number", nullable: true },
            longitude: { type: "number", nullable: true },
            isDefault: { type: "boolean" },
            fullAddress: { type: "string" },
          },
        },
        CreateAddressInput: {
          type: "object",
          required: ["title", "street", "city", "phoneNumber"],
          properties: {
            title: { type: "string", minLength: 2, maxLength: 50 },
            street: { type: "string", minLength: 5 },
            city: { type: "string", minLength: 2 },
            postalCode: { type: "string" },
            phoneNumber: { type: "string" },
            latitude: { type: "number" },
            longitude: { type: "number" },
            isDefault: { type: "boolean" },
          },
        },
        UpdateAddressInput: {
          type: "object",
          properties: {
            title: { type: "string" },
            street: { type: "string" },
            city: { type: "string" },
            postalCode: { type: "string" },
            phoneNumber: { type: "string" },
            latitude: { type: "number" },
            longitude: { type: "number" },
            isDefault: { type: "boolean" },
          },
        },

        // =====================
        // Cart Schemas
        // =====================
        CartItem: {
          type: "object",
          properties: {
            id: { type: "integer" },
            quantity: { type: "integer" },
            product: { $ref: "#/components/schemas/Product" },
            itemTotal: { type: "number" },
          },
        },
        Cart: {
          type: "object",
          properties: {
            id: { type: "integer", nullable: true },
            items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } },
            itemCount: { type: "integer" },
            subtotal: { type: "number" },
            totalDiscount: { type: "number" },
            total: { type: "number" },
          },
        },
        AddToCartInput: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: { type: "integer" },
            quantity: { type: "integer", minimum: 1, maximum: 99 },
          },
        },
        UpdateCartItemInput: {
          type: "object",
          required: ["quantity"],
          properties: {
            quantity: { type: "integer", minimum: 1, maximum: 99 },
          },
        },

        // =====================
        // Order Schemas
        // =====================
        OrderItem: {
          type: "object",
          properties: {
            id: { type: "integer" },
            productId: { type: "integer" },
            productName: { type: "string" },
            quantity: { type: "integer" },
            unitPrice: { type: "number" },
            totalPrice: { type: "number" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "integer" },
            orderNumber: { type: "string" },
            status: {
              type: "string",
              enum: [
                "pending",
                "confirmed",
                "preparing",
                "ready",
                "delivering",
                "delivered",
                "cancelled",
              ],
            },
            subtotal: { type: "number" },
            discountAmount: { type: "number" },
            deliveryCost: { type: "number" },
            totalAmount: { type: "number" },
            notes: { type: "string", nullable: true },
            discountCode: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            items: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
            address: { $ref: "#/components/schemas/Address" },
          },
        },
        CreateOrderInput: {
          type: "object",
          required: ["addressId"],
          properties: {
            addressId: { type: "integer" },
            discountCode: { type: "string" },
            notes: { type: "string" },
          },
        },
        OrderStats: {
          type: "object",
          properties: {
            total: { type: "integer" },
            pending: { type: "integer" },
            confirmed: { type: "integer" },
            preparing: { type: "integer" },
            delivering: { type: "integer" },
            delivered: { type: "integer" },
            cancelled: { type: "integer" },
            todayOrders: { type: "integer" },
            todayRevenue: { type: "number" },
          },
        },

        // =====================
        // Review Schemas
        // =====================
        Review: {
          type: "object",
          properties: {
            id: { type: "integer" },
            rating: { type: "number", minimum: 1, maximum: 5 },
            comment: { type: "string", nullable: true },
            isApproved: { type: "boolean" },
            user: {
              type: "object",
              properties: {
                id: { type: "integer" },
                firstName: { type: "string" },
                lastName: { type: "string" },
              },
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CreateReviewInput: {
          type: "object",
          required: ["productId", "rating"],
          properties: {
            productId: { type: "integer" },
            rating: { type: "number", minimum: 1, maximum: 5 },
            comment: { type: "string" },
          },
        },
        UpdateReviewInput: {
          type: "object",
          properties: {
            rating: { type: "number", minimum: 1, maximum: 5 },
            comment: { type: "string" },
          },
        },

        // =====================
        // Favorite Schemas
        // =====================
        Favorite: {
          type: "object",
          properties: {
            id: { type: "integer" },
            productId: { type: "integer" },
            product: { $ref: "#/components/schemas/Product" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    paths: {
      // =====================
      // Auth Routes
      // =====================
      "/auth/register": {
        post: {
          tags: ["Authentication"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/RegisterInput" } },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/User" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Authentication"],
          summary: "Login user",
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                      body: {
                        type: "object",
                        properties: {
                          user: { $ref: "#/components/schemas/User" },
                          accessToken: { type: "string" },
                          refreshToken: { type: "string" },
                        },
                      },
                      status: { type: "integer" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/auth/refresh": {
        post: {
          tags: ["Authentication"],
          summary: "Refresh access token",
          description:
            "Refresh token should be sent via HttpOnly Cookie (refresh_token). For testing purposes in Swagger, ensure cookies are handled.",
          responses: {
            200: {
              description: "Token refreshed",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      body: {
                        type: "object",
                        properties: { accessToken: { type: "string" } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/auth/logout": {
        post: {
          tags: ["Authentication"],
          summary: "Logout user",
          security: [{ bearerAuth: [] }],
          responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
        },
      },
      "/auth/profile": {
        get: {
          tags: ["Authentication"],
          summary: "Get current user profile",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Profile retrieved",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/User" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        patch: {
          tags: ["Authentication"],
          summary: "Update profile",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/UpdateProfileInput" } },
            },
          },
          responses: {
            200: {
              description: "Profile updated",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/User" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/auth/change-password": {
        post: {
          tags: ["Authentication"],
          summary: "Change password",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/ChangePasswordInput" } },
            },
          },
          responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
        },
      },

      // =====================
      // Category Routes
      // =====================
      "/categories": {
        get: {
          tags: ["Categories"],
          summary: "Get all active categories",
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: { type: "array", items: { $ref: "#/components/schemas/Category" } },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/categories/{id}": {
        get: {
          tags: ["Categories"],
          summary: "Get category by ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Category" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/categories/{id}/products": {
        get: {
          tags: ["Categories", "Products"],
          summary: "Get products in a category",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          ],
          responses: {
            200: {
              description: "Products with pagination",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: {
                            type: "object",
                            properties: {
                              products: {
                                type: "array",
                                items: { $ref: "#/components/schemas/Product" },
                              },
                              pagination: { $ref: "#/components/schemas/PaginationMeta" },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },

      // =====================
      // Product Routes
      // =====================
      "/products": {
        get: {
          tags: ["Products"],
          summary: "Get products with filters",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
            { name: "categoryId", in: "query", schema: { type: "integer" } },
            { name: "minPrice", in: "query", schema: { type: "number" } },
            { name: "maxPrice", in: "query", schema: { type: "number" } },
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "isPopular", in: "query", schema: { type: "boolean" } },
            {
              name: "sortBy",
              in: "query",
              schema: { type: "string", enum: ["price", "createdAt", "name", "discount"] },
            },
            { name: "sortOrder", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
          ],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: {
                            type: "object",
                            properties: {
                              items: {
                                type: "array",
                                items: { $ref: "#/components/schemas/Product" },
                              },
                              pagination: { $ref: "#/components/schemas/PaginationMeta" },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/products/popular": {
        get: {
          tags: ["Products"],
          summary: "Get popular products",
          parameters: [{ name: "limit", in: "query", schema: { type: "integer", default: 10 } }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: { type: "array", items: { $ref: "#/components/schemas/Product" } },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/products/discounted": {
        get: {
          tags: ["Products"],
          summary: "Get discounted products",
          parameters: [{ name: "limit", in: "query", schema: { type: "integer", default: 10 } }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: { type: "array", items: { $ref: "#/components/schemas/Product" } },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/products/{id}": {
        get: {
          tags: ["Products"],
          summary: "Get product details",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/ProductDetail" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },

      // =====================
      // Cart Routes
      // =====================
      "/cart": {
        get: {
          tags: ["Cart"],
          summary: "Get user cart",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Cart" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Cart"],
          summary: "Clear cart",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Cart" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/cart/count": {
        get: {
          tags: ["Cart"],
          summary: "Get cart item count",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: { type: "object", properties: { count: { type: "integer" } } },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/cart/validate": {
        get: {
          tags: ["Cart"],
          summary: "Validate cart items",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Returns cart with validation status",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: {
                            type: "object",
                            properties: {
                              isValid: { type: "boolean" },
                              unavailableItems: { type: "array", items: { type: "string" } },
                              cart: { $ref: "#/components/schemas/Cart" },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/cart/items": {
        post: {
          tags: ["Cart"],
          summary: "Add item to cart",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/AddToCartInput" } },
            },
          },
          responses: {
            201: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Cart" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/cart/items/{itemId}": {
        patch: {
          tags: ["Cart"],
          summary: "Update cart item quantity",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "itemId", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/UpdateCartItemInput" } },
            },
          },
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Cart" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Cart"],
          summary: "Remove item from cart",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "itemId", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Cart" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/cart/unavailable": {
        delete: {
          tags: ["Cart"],
          summary: "Remove unavailable items",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Cart" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },

      // =====================
      // Address Routes
      // =====================
      "/addresses": {
        get: {
          tags: ["Address"],
          summary: "Get user addresses",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: { type: "array", items: { $ref: "#/components/schemas/Address" } },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Address"],
          summary: "Create address",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CreateAddressInput" } },
            },
          },
          responses: {
            201: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Address" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/addresses/default": {
        get: {
          tags: ["Address"],
          summary: "Get default address",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Address" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/addresses/{id}": {
        get: {
          tags: ["Address"],
          summary: "Get address by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Address" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ["Address"],
          summary: "Update address",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/UpdateAddressInput" } },
            },
          },
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Address" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Address"],
          summary: "Delete address",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
        },
      },
      "/addresses/{id}/default": {
        patch: {
          tags: ["Address"],
          summary: "Set as default",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Address" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },

      // =====================
      // Order Routes
      // =====================
      "/orders": {
        get: {
          tags: ["Orders"],
          summary: "Get user orders",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
            {
              name: "status",
              in: "query",
              schema: {
                type: "string",
                enum: [
                  "pending",
                  "confirmed",
                  "preparing",
                  "ready",
                  "delivering",
                  "delivered",
                  "cancelled",
                ],
              },
            },
          ],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: {
                            type: "object",
                            properties: {
                              items: {
                                type: "array",
                                items: { $ref: "#/components/schemas/Order" },
                              },
                              pagination: { $ref: "#/components/schemas/PaginationMeta" },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Orders"],
          summary: "Create order",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CreateOrderInput" } },
            },
          },
          responses: {
            201: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Order" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/orders/{id}": {
        get: {
          tags: ["Orders"],
          summary: "Get order details",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Order" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/orders/{id}/cancel": {
        post: {
          tags: ["Orders"],
          summary: "Cancel order",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Order" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },

      // =====================
      // Review Routes
      // =====================
      "/reviews/my": {
        get: {
          tags: ["Reviews"],
          summary: "Get current user reviews",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          ],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: {
                            type: "object",
                            properties: {
                              items: {
                                type: "array",
                                items: { $ref: "#/components/schemas/Review" },
                              },
                              pagination: { $ref: "#/components/schemas/PaginationMeta" },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/reviews/can-review/{productId}": {
        get: {
          tags: ["Reviews"],
          summary: "Check if user can review",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "productId", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: { type: "object", properties: { canReview: { type: "boolean" } } },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/reviews": {
        post: {
          tags: ["Reviews"],
          summary: "Create review",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CreateReviewInput" } },
            },
          },
          responses: {
            201: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Review" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/reviews/{id}": {
        put: {
          tags: ["Reviews"],
          summary: "Update review",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/UpdateReviewInput" } },
            },
          },
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Review" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Reviews"],
          summary: "Delete review",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
        },
      },

      // =====================
      // Favorites Routes
      // =====================
      "/favorites": {
        get: {
          tags: ["Favorites"],
          summary: "Get user favorites",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: { type: "array", items: { $ref: "#/components/schemas/Favorite" } },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/favorites/toggle/{productId}": {
        post: {
          tags: ["Favorites"],
          summary: "Toggle favorite status",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "productId", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: {
                            type: "object",
                            properties: {
                              isFavorite: { type: "boolean" },
                              message: { type: "string" },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/favorites/{productId}": {
        delete: {
          tags: ["Favorites"],
          summary: "Remove from favorites",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "productId", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
        },
      },

      // =====================
      // Admin Routes
      // =====================
      "/admin/categories": {
        get: {
          tags: ["Admin - Categories"],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
          ],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: {
                            type: "object",
                            properties: {
                              items: {
                                type: "array",
                                items: { $ref: "#/components/schemas/Category" },
                              },
                              pagination: { $ref: "#/components/schemas/PaginationMeta" },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Admin - Categories"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CreateCategoryInput" } },
            },
          },
          responses: {
            201: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Category" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/admin/categories/{id}": {
        get: {
          tags: ["Admin - Categories"],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Category" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ["Admin - Categories"],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/UpdateCategoryInput" } },
            },
          },
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Category" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Admin - Categories"],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
        },
      },
      "/admin/categories/reorder": {
        put: {
          tags: ["Admin - Categories"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["orderedIds"],
                  properties: {
                    orderedIds: { type: "array", items: { type: "integer" } },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: { type: "array", items: { $ref: "#/components/schemas/Category" } },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },

      "/admin/products": {
        get: {
          tags: ["Admin - Products"],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "categoryId", in: "query", schema: { type: "integer" } },
            { name: "isAvailable", in: "query", schema: { type: "boolean" } },
          ],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: {
                            type: "object",
                            properties: {
                              items: {
                                type: "array",
                                items: { $ref: "#/components/schemas/Product" },
                              },
                              pagination: { $ref: "#/components/schemas/PaginationMeta" },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Admin - Products"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CreateProductInput" } },
            },
          },
          responses: {
            201: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/ProductDetail" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/admin/products/{id}": {
        get: {
          tags: ["Admin - Products"],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/ProductDetail" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ["Admin - Products"],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/UpdateProductInput" } },
            },
          },
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/ProductDetail" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Admin - Products"],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
        },
      },
      "/admin/products/{id}/toggle-availability": {
        patch: {
          tags: ["Admin - Products"],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/ProductDetail" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/admin/products/{id}/toggle-popular": {
        patch: {
          tags: ["Admin - Products"],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/ProductDetail" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/admin/products/{id}/images": {
        post: {
          tags: ["Admin - Products"],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["url"],
                  properties: {
                    url: { type: "string" },
                    thumbnailUrl: { type: "string" },
                    altText: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Image added" } },
        },
      },
      "/admin/products/images/{imageId}": {
        put: {
          tags: ["Admin - Products"],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "imageId", in: "path", required: true, schema: { type: "integer" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    url: { type: "string" },
                    thumbnailUrl: { type: "string" },
                    altText: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Image updated" } },
        },
        delete: {
          tags: ["Admin - Products"],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "imageId", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
        },
      },

      "/admin/orders/stats": {
        get: {
          tags: ["Admin - Orders"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/OrderStats" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/admin/orders": {
        get: {
          tags: ["Admin - Orders"],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
            {
              name: "status",
              in: "query",
              schema: {
                type: "string",
                enum: [
                  "pending",
                  "confirmed",
                  "preparing",
                  "ready",
                  "delivering",
                  "delivered",
                  "cancelled",
                ],
              },
            },
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "startDate", in: "query", schema: { type: "string", format: "date-time" } },
            { name: "endDate", in: "query", schema: { type: "string", format: "date-time" } },
          ],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: {
                            type: "object",
                            properties: {
                              items: {
                                type: "array",
                                items: { $ref: "#/components/schemas/Order" },
                              },
                              pagination: { $ref: "#/components/schemas/PaginationMeta" },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/admin/orders/{id}": {
        get: {
          tags: ["Admin - Orders"],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Order" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/admin/orders/{id}/status": {
        patch: {
          tags: ["Admin - Orders"],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: [
                        "pending",
                        "confirmed",
                        "preparing",
                        "ready",
                        "delivering",
                        "delivered",
                        "cancelled",
                      ],
                    },
                    estimatedDelivery: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Order" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },

      "/admin/reviews/stats": {
        get: {
          tags: ["Admin - Reviews"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: {
                            type: "object",
                            properties: {
                              total: { type: "integer" },
                              pending: { type: "integer" },
                              approved: { type: "integer" },
                              averageRating: { type: "number" },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/admin/reviews": {
        get: {
          tags: ["Admin - Reviews"],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
            { name: "isApproved", in: "query", schema: { type: "boolean" } },
            { name: "productId", in: "query", schema: { type: "integer" } },
            { name: "rating", in: "query", schema: { type: "integer", minimum: 1, maximum: 5 } },
          ],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: {
                            type: "object",
                            properties: {
                              items: {
                                type: "array",
                                items: { $ref: "#/components/schemas/Review" },
                              },
                              pagination: { $ref: "#/components/schemas/PaginationMeta" },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/admin/reviews/{id}": {
        get: {
          tags: ["Admin - Reviews"],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Review" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Admin - Reviews"],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
        },
      },
      "/admin/reviews/{id}/approval": {
        patch: {
          tags: ["Admin - Reviews"],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["isApproved"],
                  properties: { isApproved: { type: "boolean" } },
                },
              },
            },
          },
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: { body: { $ref: "#/components/schemas/Review" } },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/admin/reviews/bulk-approve": {
        post: {
          tags: ["Admin - Reviews"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["reviewIds"],
                  properties: { reviewIds: { type: "array", items: { type: "integer" } } },
                },
              },
            },
          },
          responses: { 200: { description: "Approved" } },
        },
      },
      "/admin/reviews/bulk-delete": {
        post: {
          tags: ["Admin - Reviews"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["reviewIds"],
                  properties: { reviewIds: { type: "array", items: { type: "integer" } } },
                },
              },
            },
          },
          responses: { 200: { description: "Deleted" } },
        },
      },

      "/admin/settings": {
        get: {
          tags: ["Admin - Settings"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          body: { type: "object", additionalProperties: { type: "string" } },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/admin/settings/{key}": {
        patch: {
          tags: ["Admin - Settings"],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "key", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["value"],
                  properties: { value: { type: "string" } },
                },
              },
            },
          },
          responses: { 200: { description: "Setting updated" } },
        },
      },
    },
  },
  apis: [], // Empty because we define paths manually above
};

export const swaggerSpec = swaggerJsdoc(options);
