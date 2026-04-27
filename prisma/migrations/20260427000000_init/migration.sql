-- Migration: Init
-- Created: 2026-04-27 00:00:00 UTC
-- Description: Initial migration for FaDel Delivery database

-- Create enum types if needed
-- (PostgreSQL handles enums differently, but we'll use CHECK constraints)

-- Create profiles table
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "phone" TEXT,
    "avatar_url" TEXT,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_rider" BOOLEAN NOT NULL DEFAULT false,
    "is_partner" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- Create cuisine_categories table
CREATE TABLE "cuisine_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "cuisine_categories_pkey" PRIMARY KEY ("id")
);

-- Create restaurants table
CREATE TABLE "restaurants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "website" TEXT,
    "logo_url" TEXT,
    "cover_image_url" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Chad',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "delivery_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minimum_order" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimated_delivery" INTEGER NOT NULL DEFAULT 30,
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Ndjamena',
    "owner_id" UUID NOT NULL,
    "cuisine_category_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- Create opening_hours table
CREATE TABLE "opening_hours" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "open_time" TEXT NOT NULL,
    "close_time" TEXT NOT NULL,
    "is_open" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "opening_hours_pkey" PRIMARY KEY ("id")
);

-- Create delivery_zones table
CREATE TABLE "delivery_zones" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coordinates" JSONB,
    "delivery_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minimum_order" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "delivery_zones_pkey" PRIMARY KEY ("id")
);

-- Create menu_categories table
CREATE TABLE "menu_categories" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "menu_categories_pkey" PRIMARY KEY ("id")
);

-- Create menu_items table
CREATE TABLE "menu_items" (
    "id" TEXT NOT NULL,
    "menu_category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "image_url" TEXT,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "is_vegetarian" BOOLEAN NOT NULL DEFAULT false,
    "is_vegan" BOOLEAN NOT NULL DEFAULT false,
    "is_gluten_free" BOOLEAN NOT NULL DEFAULT false,
    "is_halal" BOOLEAN NOT NULL DEFAULT false,
    "is_kosher" BOOLEAN NOT NULL DEFAULT false,
    "preparation_time" INTEGER,
    "calories" INTEGER,
    "allergens" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ingredients" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- Create menu_modifier_groups table
CREATE TABLE "menu_modifier_groups" (
    "id" TEXT NOT NULL,
    "menu_item_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "min_selections" INTEGER NOT NULL DEFAULT 0,
    "max_selections" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "menu_modifier_groups_pkey" PRIMARY KEY ("id")
);

-- Create menu_modifier_options table
CREATE TABLE "menu_modifier_options" (
    "id" TEXT NOT NULL,
    "modifier_group_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "menu_modifier_options_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");
CREATE UNIQUE INDEX "cuisine_categories_name_key" ON "cuisine_categories"("name");
CREATE UNIQUE INDEX "restaurants_email_key" ON "restaurants"("email");
CREATE INDEX "cuisine_categories_is_active_sort_order_idx" ON "cuisine_categories"("is_active", "sort_order");
CREATE INDEX "restaurants_is_active_city_idx" ON "restaurants"("is_active", "city");
CREATE INDEX "restaurants_latitude_longitude_idx" ON "restaurants"("latitude", "longitude");
CREATE INDEX "restaurants_rating_idx" ON "restaurants"("rating");
CREATE INDEX "restaurants_owner_id_idx" ON "restaurants"("owner_id");
CREATE INDEX "restaurants_cuisine_category_id_idx" ON "restaurants"("cuisine_category_id");
CREATE UNIQUE INDEX "opening_hours_restaurant_id_day_of_week_key" ON "opening_hours"("restaurant_id", "day_of_week");
CREATE INDEX "opening_hours_restaurant_id_day_of_week_idx" ON "opening_hours"("restaurant_id", "day_of_week");
CREATE INDEX "delivery_zones_restaurant_id_is_active_idx" ON "delivery_zones"("restaurant_id", "is_active");
CREATE INDEX "menu_categories_restaurant_id_is_active_sort_order_idx" ON "menu_categories"("restaurant_id", "is_active", "sort_order");
CREATE INDEX "menu_items_menu_category_id_is_available_sort_order_idx" ON "menu_items"("menu_category_id", "is_available", "sort_order");
CREATE INDEX "menu_items_dietary_filters_idx" ON "menu_items"("is_vegetarian", "is_vegan", "is_halal");
CREATE INDEX "menu_modifier_groups_menu_item_id_sort_order_idx" ON "menu_modifier_groups"("menu_item_id", "sort_order");
CREATE INDEX "menu_modifier_options_modifier_group_id_is_available_sort_order_idx" ON "menu_modifier_options"("modifier_group_id", "is_available", "sort_order");

-- Create foreign key constraints
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_cuisine_category_id_fkey" FOREIGN KEY ("cuisine_category_id") REFERENCES "cuisine_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "opening_hours" ADD CONSTRAINT "opening_hours_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "delivery_zones" ADD CONSTRAINT "delivery_zones_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu_categories" ADD CONSTRAINT "menu_categories_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_menu_category_id_fkey" FOREIGN KEY ("menu_category_id") REFERENCES "menu_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu_modifier_groups" ADD CONSTRAINT "menu_modifier_groups_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu_modifier_options" ADD CONSTRAINT "menu_modifier_options_modifier_group_id_fkey" FOREIGN KEY ("modifier_group_id") REFERENCES "menu_modifier_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add check constraints for data validation
ALTER TABLE "opening_hours" ADD CONSTRAINT "opening_hours_day_of_week_check" CHECK ("day_of_week" >= 0 AND "day_of_week" <= 6);
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_rating_check" CHECK ("rating" >= 0 AND "rating" <= 5);
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_price_check" CHECK ("price" >= 0);
ALTER TABLE "menu_modifier_options" ADD CONSTRAINT "menu_modifier_options_price_check" CHECK ("price" >= 0);

-- Create trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON "profiles" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cuisine_categories_updated_at BEFORE UPDATE ON "cuisine_categories" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON "restaurants" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opening_hours_updated_at BEFORE UPDATE ON "opening_hours" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delivery_zones_updated_at BEFORE UPDATE ON "delivery_zones" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON "menu_categories" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON "menu_items" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_modifier_groups_updated_at BEFORE UPDATE ON "menu_modifier_groups" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_modifier_options_updated_at BEFORE UPDATE ON "menu_modifier_options" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();