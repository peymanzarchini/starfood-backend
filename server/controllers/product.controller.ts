import { Request, Response, NextFunction } from "express";
import { productService } from "../services/product.service.js";
import {
  CreateProductInput,
  UpdateProductInput,
  GetProductsQuery,
} from "../validators/schemas/product.schema.js";

/**
 * Product Controller
 * Handles HTTP requests for products
 */
class ProductController {
  // ============================================================
  // PUBLIC ENDPOINTS
  // ============================================================

  /**
   * Get products with filters
   * GET /api/products
   */
  async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: GetProductsQuery = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        search: req.query.search as string | undefined,
        isPopular: req.query.isPopular === "true" ? true : undefined,
        sortBy: (req.query.sortBy as GetProductsQuery["sortBy"]) || "createdAt",
        sortOrder: (req.query.sortOrder as GetProductsQuery["sortOrder"]) || "desc",
      };

      const result = await productService.getProducts(query);

      res.success("Products retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product by ID
   * GET /api/products/:id
   */
  async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      const product = await productService.getProductById(id);

      res.success("Product retrieved successfully", product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get popular products
   * GET /api/products/popular
   */
  async getPopularProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = Number(req.query.limit) || 10;

      const products = await productService.getPopularProducts(limit);

      res.success("Popular products retrieved successfully", products);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get discounted products
   * GET /api/products/discounted
   */
  async getDiscountedProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = Number(req.query.limit) || 10;

      const products = await productService.getDiscountedProducts(limit);

      res.success("Discounted products retrieved successfully", products);
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // ADMIN ENDPOINTS
  // ============================================================

  /**
   * Get all products (admin)
   * GET /api/admin/products
   */
  async getAllProductsAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: GetProductsQuery = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
        search: req.query.search as string | undefined,
        isAvailable:
          req.query.isAvailable === "true"
            ? true
            : req.query.isAvailable === "false"
            ? false
            : undefined,
        sortBy: (req.query.sortBy as GetProductsQuery["sortBy"]) || "createdAt",
        sortOrder: (req.query.sortOrder as GetProductsQuery["sortOrder"]) || "desc",
      };

      const result = await productService.getAllProductsAdmin(query);

      res.success("Products retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product by ID (admin)
   * GET /api/admin/products/:id
   */
  async getProductByIdAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      const product = await productService.getProductByIdAdmin(id);

      res.success("Product retrieved successfully", product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create product (admin)
   * POST /api/admin/products
   */
  async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateProductInput = req.body;

      const product = await productService.createProduct(data);

      res.success("Product created successfully", product, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update product (admin)
   * PUT /api/admin/products/:id
   */
  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const data: UpdateProductInput = req.body;

      const product = await productService.updateProduct(id, data);

      res.success("Product updated successfully", product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete product (admin)
   * DELETE /api/admin/products/:id
   */
  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      await productService.deleteProduct(id);

      res.success("Product deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle product availability (admin)
   * PATCH /api/admin/products/:id/toggle-availability
   */
  async toggleAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      const product = await productService.toggleAvailability(id);

      res.success("Product availability toggled successfully", product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle product popular status (admin)
   * PATCH /api/admin/products/:id/toggle-popular
   */
  async togglePopular(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      const product = await productService.togglePopular(id);

      res.success("Product popular status toggled successfully", product);
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // PRODUCT IMAGES (ADMIN)
  // ============================================================

  /**
   * Add image to product gallery
   * POST /api/admin/products/:id/images
   */
  async addProductImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = parseInt(req.params.id, 10);
      const { url, thumbnailUrl, altText } = req.body;

      const image = await productService.addProductImage(productId, {
        url,
        thumbnailUrl,
        altText,
      });

      res.success("Image added successfully", image, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update product image
   * PUT /api/admin/products/images/:imageId
   */
  async updateProductImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const imageId = parseInt(req.params.imageId, 10);
      const { url, thumbnailUrl, altText } = req.body;

      const image = await productService.updateProductImage(imageId, {
        url,
        thumbnailUrl,
        altText,
      });

      res.success("Image updated successfully", image);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete product image
   * DELETE /api/admin/products/images/:imageId
   */
  async deleteProductImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const imageId = parseInt(req.params.imageId, 10);

      await productService.deleteProductImage(imageId);

      res.success("Image deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reorder product images
   * PUT /api/admin/products/:id/images/reorder
   */
  async reorderProductImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = parseInt(req.params.id, 10);
      const { orderedIds } = req.body;

      if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        res.fail("orderedIds must be a non-empty array", null, 400);
        return;
      }

      const images = await productService.reorderProductImages(productId, orderedIds);

      res.success("Images reordered successfully", images);
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
