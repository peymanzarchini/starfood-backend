import { Request, Response, NextFunction } from "express";
import { productService } from "../services/product.service.js";
import {
  CreateProductInput,
  UpdateProductInput,
  GetProductsQuery,
  AddProductImagesInput,
  UpdateProductImageInput,
} from "../validators/schemas/product.schema.js";
import { getPaginationMeta, normalizePagination } from "../utils/pagination.js";

class ProductController {
  async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedQuery = req.query as unknown as GetProductsQuery;

      const pagination = normalizePagination(validatedQuery.page, validatedQuery.limit);
      const query: GetProductsQuery = {
        page: pagination.page,
        limit: pagination.limit,
        categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        search: req.query.search as string | undefined,
        isPopular: req.query.isPopular === "true" ? true : undefined,
        sortBy: (req.query.sortBy as GetProductsQuery["sortBy"]) || "createdAt",
        sortOrder: (req.query.sortOrder as GetProductsQuery["sortOrder"]) || "desc",
      };

      const { items, totalItems } = await productService.getProducts(query);

      const paginationMeta = getPaginationMeta(totalItems, pagination.page, pagination.limit);

      res.success("Products retrieved successfully", items, 200, paginationMeta);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      const product = await productService.getProductById(id);

      res.success("Product retrieved successfully", product);
    } catch (error) {
      next(error);
    }
  }

  async getPopularProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = Number(req.query.limit) || 10;

      const products = await productService.getPopularProducts(limit);

      res.success("Popular products retrieved successfully", products);
    } catch (error) {
      next(error);
    }
  }

  async getDiscountedProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = Number(req.query.limit) || 10;

      const products = await productService.getDiscountedProducts(limit);

      res.success("Discounted products retrieved successfully", products);
    } catch (error) {
      next(error);
    }
  }

  async getAllProductsAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = normalizePagination(Number(req.query.page), Number(req.query.limit));

      const query: GetProductsQuery = {
        page: pagination.page,
        limit: pagination.limit,
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

      const { items, totalItems } = await productService.getAllProductsAdmin(query);

      const paginationMeta = getPaginationMeta(totalItems, pagination.page, pagination.limit);

      res.success("Products retrieved successfully", items, 200, paginationMeta);
    } catch (error) {
      next(error);
    }
  }

  async getProductByIdAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      const product = await productService.getProductByIdAdmin(id);

      res.success("Product retrieved successfully", product);
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateProductInput = req.body;

      const product = await productService.createProduct(data);

      res.success("Product created successfully", product, 201);
    } catch (error) {
      next(error);
    }
  }

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

  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      await productService.deleteProduct(id);

      res.success("Product deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  async toggleAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      const product = await productService.toggleAvailability(id);

      res.success("Product availability toggled successfully", product);
    } catch (error) {
      next(error);
    }
  }

  async togglePopular(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      const product = await productService.togglePopular(id);

      res.success("Product popular status toggled successfully", product);
    } catch (error) {
      next(error);
    }
  }

  async addProductImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = parseInt(req.params.id, 10);
      const data: AddProductImagesInput = req.body;

      const images = await productService.addProductImages(productId, data);

      res.success("Images added successfully", images, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateProductImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const imageId = parseInt(req.params.imageId, 10);
      const data: UpdateProductImageInput = req.body;

      const image = await productService.updateProductImage(imageId, data);

      res.success("Image updated successfully", image);
    } catch (error) {
      next(error);
    }
  }

  async deleteProductImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const imageId = parseInt(req.params.imageId, 10);

      await productService.deleteProductImage(imageId);

      res.success("Image deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

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

  async setCoverImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = parseInt(req.params.id, 10);
      const imageId = parseInt(req.params.imageId, 10);

      const product = await productService.setCoverImageFromGallery(productId, imageId);

      res.success("Cover image set successfully from gallery", product);
    } catch (error) {
      next(error);
    }
  }

  async removeCoverImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = parseInt(req.params.id, 10);

      const product = await productService.removeCoverImage(productId);

      res.success("Cover image removed successfully", product);
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
