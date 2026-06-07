import { Op } from "@sequelize/core";
import { Product, ProductImage, Category } from "../models/index.js";
import { HttpError } from "../utils/httpError.js";
import { paginate, getOffset } from "../utils/pagination.js";
import {
  formatProductListResponse,
  formatProductDetailResponse,
  formatProductImageResponse,
} from "../utils/format-response/formatProductResponse.js";
import {
  ProductListResponse,
  ProductDetailResponse,
  ProductImageResponse,
} from "../types/index.js";
import {
  CreateProductInput,
  UpdateProductInput,
  GetProductsQuery,
} from "../validators/schemas/product.schema.js";

class ProductService {
  private buildWhereClause(query: GetProductsQuery, includeUnavailable = false) {
    const where: Record<string, unknown> = {};

    if (!includeUnavailable) {
      where.isAvailable = true;
    } else if (query.isAvailable !== undefined) {
      where.isAvailable = query.isAvailable;
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    where.price = {
      ...(query.minPrice !== undefined && { [Op.gte]: query.minPrice }),
      ...(query.maxPrice !== undefined && { [Op.lte]: query.maxPrice }),
    };

    if (query.isPopular !== undefined) {
      where.isPopular = query.isPopular;
    }

    if (query.search) {
      where[Op.or as unknown as string] = [
        { name: { [Op.like]: `%${query.search}%` } },
        { description: { [Op.like]: `%${query.search}%` } },
      ];
    }

    return where;
  }

  async getProducts(query: GetProductsQuery) {
    const { page, limit } = query;
    const offset = getOffset(page, limit);

    const where = this.buildWhereClause(query, false);

    const orderField = query.sortBy || "createdAt";
    const orderDirection = query.sortOrder || "desc";

    const { count, rows } = await Product.findAndCountAll({
      where,
      order: [[orderField, orderDirection.toUpperCase()]],
      limit,
      offset,
    });

    const products = rows.map(formatProductListResponse);

    return paginate(products, count, page, limit);
  }

  async getAllProductsAdmin(query: GetProductsQuery) {
    const { page, limit } = query;
    const offset = getOffset(page, limit);

    const where = this.buildWhereClause(query, true);

    const orderField = query.sortBy || "createdAt";
    const orderDirection = query.sortOrder || "desc";

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      order: [[orderField, orderDirection.toUpperCase()]],
      limit,
      offset,
    });

    const products = rows.map(formatProductListResponse);

    return paginate(products, count, page, limit);
  }

  async getProductById(id: number): Promise<ProductDetailResponse> {
    const product = await Product.findOne({
      where: { id, isAvailable: true },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "url", "thumbnailUrl", "altText", "displayOrder"],
        },
      ],
    });

    if (!product) {
      throw HttpError.notFound("Product not found");
    }

    return formatProductDetailResponse(product);
  }

  async getProductByIdAdmin(id: number): Promise<ProductDetailResponse> {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "url", "thumbnailUrl", "altText", "displayOrder"],
        },
      ],
    });

    if (!product) {
      throw HttpError.notFound("Product not found");
    }

    return formatProductDetailResponse(product);
  }

  async getPopularProducts(limit: number = 10): Promise<ProductListResponse[]> {
    const products = await Product.findAll({
      where: {
        isAvailable: true,
        isPopular: true,
      },
      order: [["createdAt", "DESC"]],
      limit,
    });

    return products.map(formatProductListResponse);
  }

  async getDiscountedProducts(limit: number = 10): Promise<ProductListResponse[]> {
    const products = await Product.findAll({
      where: {
        isAvailable: true,
        discount: { [Op.gt]: 0 },
      },
      order: [["discount", "DESC"]],
      limit,
    });

    return products.map(formatProductListResponse);
  }

  async createProduct(data: CreateProductInput): Promise<ProductDetailResponse> {
    const category = await Category.findByPk(data.categoryId);
    if (!category) {
      throw HttpError.badRequest("Category not found");
    }

    const product = await Product.create({
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl!,
      categoryId: data.categoryId,
      ingredients: data.ingredients || [],
      preparationTime: data.preparationTime,
      calories: data.calories,
      discount: data.discount || 0,
      isAvailable: data.isAvailable ?? true,
      isPopular: data.isPopular ?? false,
    });

    return this.getProductByIdAdmin(product.id);
  }

  async updateProduct(id: number, data: UpdateProductInput): Promise<ProductDetailResponse> {
    const product = await Product.findByPk(id);

    if (!product) {
      throw HttpError.notFound("Product not found");
    }

    if (data.categoryId && data.categoryId !== product.categoryId) {
      const category = await Category.findByPk(data.categoryId);
      if (!category) {
        throw HttpError.badRequest("Category not found");
      }
    }

    await product.update({
      name: data.name ?? product.name,
      description: data.description ?? product.description,
      price: data.price ?? product.price,
      imageUrl: data.imageUrl ?? product.imageUrl,
      categoryId: data.categoryId ?? product.categoryId,
      ingredients: data.ingredients ?? product.ingredients,
      preparationTime: data.preparationTime ?? product.preparationTime,
      calories: data.calories ?? product.calories,
      discount: data.discount ?? product.discount,
      isAvailable: data.isAvailable ?? product.isAvailable,
      isPopular: data.isPopular ?? product.isPopular,
    });

    return this.getProductByIdAdmin(id);
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await Product.findByPk(id);

    if (!product) {
      throw HttpError.notFound("Product not found");
    }

    await ProductImage.destroy({ where: { productId: id } });

    await product.destroy();
  }

  async toggleAvailability(id: number): Promise<ProductDetailResponse> {
    const product = await Product.findByPk(id);

    if (!product) {
      throw HttpError.notFound("Product not found");
    }

    await product.update({ isAvailable: !product.isAvailable });

    return this.getProductByIdAdmin(id);
  }

  async togglePopular(id: number): Promise<ProductDetailResponse> {
    const product = await Product.findByPk(id);

    if (!product) {
      throw HttpError.notFound("Product not found");
    }

    await product.update({ isPopular: !product.isPopular });

    return this.getProductByIdAdmin(id);
  }

  async addProductImage(
    productId: number,
    data: { url: string; thumbnailUrl?: string; altText?: string },
  ): Promise<ProductImageResponse> {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw HttpError.notFound("Product not found");
    }

    const maxOrder = await ProductImage.max<number, ProductImage>("displayOrder", {
      where: { productId },
    });

    const image = await ProductImage.create({
      url: data.url,
      thumbnailUrl: data.thumbnailUrl,
      altText: data.altText,
      displayOrder: (maxOrder || 0) + 1,
      productId,
    });

    return formatProductImageResponse(image);
  }

  async updateProductImage(
    imageId: number,
    data: { url?: string; thumbnailUrl?: string; altText?: string },
  ): Promise<ProductImageResponse> {
    const image = await ProductImage.findByPk(imageId);

    if (!image) {
      throw HttpError.notFound("Image not found");
    }

    await image.update({
      url: data.url ?? image.url,
      thumbnailUrl: data.thumbnailUrl ?? image.thumbnailUrl,
      altText: data.altText ?? image.altText,
    });

    return formatProductImageResponse(image);
  }

  async deleteProductImage(imageId: number): Promise<void> {
    const image = await ProductImage.findByPk(imageId);

    if (!image) {
      throw HttpError.notFound("Image not found");
    }

    await image.destroy();
  }

  async reorderProductImages(
    productId: number,
    orderedIds: number[],
  ): Promise<ProductImageResponse[]> {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw HttpError.notFound("Product not found");
    }

    const images = await ProductImage.findAll({
      where: { id: orderedIds, productId },
    });

    if (images.length !== orderedIds.length) {
      throw HttpError.badRequest("Some image IDs are invalid");
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        ProductImage.update({ displayOrder: index }, { where: { id } }),
      ),
    );

    const updatedImages = await ProductImage.findAll({
      where: { productId },
      order: [["displayOrder", "ASC"]],
    });

    return updatedImages.map(formatProductImageResponse);
  }
}

export const productService = new ProductService();
