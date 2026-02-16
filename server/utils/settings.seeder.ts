import { Settings } from "../models/index.js";
import { logger } from "../config/logger.js";

/**
 * Default settings for StarFood restaurant
 * All monetary values in USD
 */
const defaultSettings = [
  {
    key: "restaurant_name",
    value: "StarFood",
    description: "Restaurant name",
  },
  {
    key: "opening_hour",
    value: "10:00",
    description: "Opening time",
  },
  {
    key: "closing_hour",
    value: "23:00",
    description: "Closing time",
  },
  {
    key: "delivery_fee",
    value: "5",
    description: "Delivery fee (USD)",
  },
  {
    key: "min_order_amount",
    value: "10",
    description: "Minimum order amount (USD)",
  },
  {
    key: "free_delivery_threshold",
    value: "50",
    description: "Free delivery threshold (USD)",
  },
  {
    key: "delivery_radius_km",
    value: "5",
    description: "Delivery radius (km)",
  },
  {
    key: "is_open",
    value: "true",
    description: "Restaurant open status",
  },
  {
    key: "phone_number",
    value: "+1-555-123-4567",
    description: "Restaurant phone number",
  },
  {
    key: "address",
    value: "123 Main Street, New York, NY 10001",
    description: "Restaurant address",
  },
  {
    key: "tax_percentage",
    value: "8",
    description: "Tax percentage",
  },
  {
    key: "instagram",
    value: "@starfood",
    description: "Instagram handle",
  },
  {
    key: "telegram",
    value: "@starfood_bot",
    description: "Telegram bot",
  },
  {
    key: "whatsapp",
    value: "+15551234567",
    description: "WhatsApp number",
  },
];

/**
 * Seed default settings to database
 * Only inserts if setting doesn't exist
 */
export async function seedSettings(): Promise<void> {
  try {
    logger.info("🌱 Seeding settings...");

    let created = 0;
    let skipped = 0;

    for (const setting of defaultSettings) {
      const existing = await Settings.findOne({
        where: { key: setting.key },
      });

      if (!existing) {
        await Settings.create(setting);
        created++;
        logger.debug(`  ✓ Created: ${setting.key}`);
      } else {
        skipped++;
      }
    }

    logger.info(`✅ Settings seeding completed: ${created} created, ${skipped} skipped`);
  } catch (error) {
    logger.error("❌ Error seeding settings:", error);
    throw error;
  }
}

/**
 * Create default admin user
 */
export async function seedAdminUser(): Promise<void> {
  const { User } = await import("../models/index.js");

  try {
    logger.info("🌱 Seeding admin user...");

    const existingAdmin = await User.findOne({
      where: { role: "admin" },
    });

    if (existingAdmin) {
      logger.info("  ✓ Admin user already exists, skipping...");
      return;
    }

    await User.create({
      firstName: "Admin",
      lastName: "StarFood",
      email: "admin@starfood.com",
      password: "Admin@123456", // Will be hashed by model hook
      phoneNumber: "+15551234567",
      role: "admin",
    });

    logger.info("✅ Admin user created successfully");
    logger.info("   Email: admin@starfood.com");
    logger.info("   Password: Admin@123456");
    logger.warn("   ⚠️  Please change the admin password after first login!");
  } catch (error) {
    logger.error("❌ Error seeding admin user:", error);
    throw error;
  }
}

/**
 * Create sample categories
 */
export async function seedCategories(): Promise<void> {
  const { Category } = await import("../models/index.js");

  try {
    logger.info("🌱 Seeding categories...");

    const existingCount = await Category.count();

    if (existingCount > 0) {
      logger.info(`  ✓ ${existingCount} categories already exist, skipping...`);
      return;
    }

    const categories = [
      { name: "Burgers", description: "Delicious burger selections", displayOrder: 1 },
      { name: "Pizzas", description: "Italian style pizzas", displayOrder: 2 },
      { name: "Sandwiches", description: "Various sandwiches", displayOrder: 3 },
      { name: "Fried Chicken", description: "Crispy fried chicken", displayOrder: 4 },
      { name: "Sides", description: "Appetizers and sides", displayOrder: 5 },
      { name: "Drinks", description: "Cold and hot beverages", displayOrder: 6 },
      { name: "Desserts", description: "Sweet desserts", displayOrder: 7 },
      { name: "Combos", description: "Special combo packages", displayOrder: 8 },
    ];

    await Category.bulkCreate(categories);

    logger.info(`✅ ${categories.length} categories created successfully`);
  } catch (error) {
    logger.error("❌ Error seeding categories:", error);
    throw error;
  }
}

/**
 * Run all seeders
 */
export async function runSeeders(): Promise<void> {
  logger.info("🚀 Starting database seeding...");

  try {
    await seedSettings();
    await seedAdminUser();
    await seedCategories();

    logger.info("🎉 Database seeding completed successfully!");
  } catch (error) {
    logger.error("❌ Database seeding failed:", error);
    // Don't throw - allow app to continue even if seeding fails
  }
}
