import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services/category.service.js";
import { normalizePagination } from "../utils/pagination.js";
import { CreateCategoryInput, UpdateCategoryInput } from "../validators/schemas/category.schema.js";

class CategoryController {
  async getActiveCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getActiveCategories();
      res.success("Categories retrieved successfully", categories);
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = normalizePagination(Number(req.query.page), Number(req.query.limit));
      const result = await categoryService.getAllCategories(pagination);
      res.success("Categories retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const category = await categoryService.getCategoryById(id, true);
      res.success("Category retrieved successfully", category);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryByIdAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      const category = await categoryService.getCategoryById(id, false);

      res.success("Category retrieved successfully", category);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = parseInt(req.params.id, 10);
      const pagination = normalizePagination(Number(req.query.page), Number(req.query.limit));

      const result = await categoryService.getCategoryProducts(categoryId, pagination);

      res.success("Products retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateCategoryInput = req.body;

      const category = await categoryService.createCategory(data);

      res.success("Category created successfully", category, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const data: UpdateCategoryInput = req.body;

      const category = await categoryService.updateCategory(id, data);

      res.success("Category updated successfully", category);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      await categoryService.deleteCategory(id);

      res.success("Category deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  async reorderCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderedIds } = req.body;

      if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        res.fail("orderedIds must be a non-empty array", null, 400);
        return;
      }

      const categories = await categoryService.reorderCategories(orderedIds);

      res.success("Categories reordered successfully", categories);
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
