import { Op } from "@sequelize/core";
import { Category, Product } from "../models/index.js";
import { HttpError } from "../utils/httpError.js";
import { paginate, getOffset, PaginationOptions } from "../utils/pagination.js";
import { CreateCategoryInput, UpdateCategoryInput } from "../validators/schemas/category.schema.js";
import { CategoryResponse } from "../types/index.js";
import { formatCategoryResponse } from "../utils/formatCategoryResponse.js";

class CategoryService {
  async getActiveCategories(): Promise<CategoryResponse[]> {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [["displayOrder", "ASC"]],
    });

    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.count({
          where: {
            categoryId: category.id,
            isAvailable: true,
          },
        });
        return formatCategoryResponse(category, productCount);
      })
    );
    return categoriesWithCounts;
  }

  async getAllCategories(pagination: PaginationOptions) {
    const { page, limit } = pagination;
    const offset = getOffset(page, limit);

    const { count, rows } = await Category.findAndCountAll({
      order: [["displayOrder", "ASC"]],
      limit,
      offset,
    });
    const categoriesWithCounts = await Promise.all(
      rows.map(async (category) => {
        const productCount = await Product.count({
          where: { categoryId: category.id },
        });
        return formatCategoryResponse(category, productCount);
      })
    );
    return paginate(categoriesWithCounts, count, page, limit);
  }

  async getCategoryById(id: number, activeOnly: boolean = true): Promise<CategoryResponse> {
    const whereClause: { id: number; isActive?: boolean } = { id };
    if (activeOnly) {
      whereClause.isActive = true;
    }
    const category = await Category.findOne({
      where: whereClause,
    });
    if (!category) {
      throw HttpError.notFound("Category not found");
    }

    const productCount = await Product.count({
      where: {
        categoryId: category.id,
        ...(activeOnly && { isAvailable: true }),
      },
    });
    return formatCategoryResponse(category, productCount);
  }

  async getCategoryProducts(categoryId: number, pagination: PaginationOptions) {
    const { page, limit } = pagination;
    const offset = getOffset(page, limit);

    const category = await Category.findOne({
      where: { id: categoryId, isActive: true },
    });
    if (!category) {
      throw HttpError.notFound("Category not found");
    }

    const { count, rows } = await Product.findAndCountAll({
      where: {
        categoryId,
        isAvailable: true,
      },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const products = rows.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      finalPrice: product.finalPrice,
      discount: product.discount,
      imageUrl: product.imageUrl,
      isAvailable: product.isAvailable,
      isPopular: product.isPopular,
      preparationTime: product.preparationTime,
      calories: product.calories,
    }));

    return {
      category: formatCategoryResponse(category),
      products: paginate(products, count, page, limit),
    };
  }

  async createCategory(data: CreateCategoryInput): Promise<CategoryResponse> {
    const existingCategory = await Category.findOne({
      where: {
        name: {
          [Op.like]: data.name,
        },
      },
    });
    if (existingCategory) {
      throw HttpError.conflict("Category with this name already exists");
    }
    if (data.displayOrder === undefined) {
      const maxOrder = await Category.max<number, Category>("displayOrder");
      data.displayOrder = (maxOrder || 0) + 1;
    }
    const category = await Category.create({
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      displayOrder: data.displayOrder,
      isActive: data.isActive ?? true,
    });

    return formatCategoryResponse(category);
  }

  async updateCategory(id: number, data: UpdateCategoryInput): Promise<CategoryResponse> {
    const category = await Category.findByPk(id);

    if (!category) {
      throw HttpError.notFound("Category not found");
    }

    if (data.name && data.name !== category.name) {
      const existingCategory = await Category.findOne({
        where: {
          name: { [Op.like]: data.name },
          id: { [Op.ne]: id },
        },
      });
      if (existingCategory) {
        throw HttpError.conflict("Category with this name already exists");
      }
    }
    await category.update({
      name: data.name ?? category.name,
      description: data.description ?? category.description,
      imageUrl: data.imageUrl ?? category.imageUrl,
      displayOrder: data.displayOrder ?? category.displayOrder,
      isActive: data.isActive ?? category.isActive,
    });

    const productCount = await Product.count({
      where: { categoryId: category.id },
    });

    return formatCategoryResponse(category, productCount);
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await Category.findByPk(id);

    if (!category) {
      throw HttpError.notFound("Category not found");
    }

    // Check if category has products
    const productCount = await Product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw HttpError.badRequest(
        `Cannot delete category. It has ${productCount} product(s). Please move or delete the products first.`
      );
    }

    await category.destroy();
  }

  async reorderCategories(orderedIds: number[]): Promise<CategoryResponse[]> {
    const categories = await Category.findAll({
      where: {
        id: orderedIds,
      },
    });
    if (categories.length !== orderedIds.length) {
      throw HttpError.badRequest("Some category IDs are invalid");
    }
    await Promise.all(
      orderedIds.map((id, index) => Category.update({ displayOrder: index }, { where: { id } }))
    );
    return this.getActiveCategories();
  }
}

export const categoryService = new CategoryService();
