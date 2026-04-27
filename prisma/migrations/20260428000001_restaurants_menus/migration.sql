-- Migration: restaurants + menus
-- Description: Création des tables Restaurant, MenuCategory, MenuItem, MenuModifierGroup et MenuModifierOption.

CREATE TABLE IF NOT EXISTS "restaurants" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "updated_at" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "menu_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "menu_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "updated_at" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "menu_modifier_groups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "menu_item_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "min_selections" INTEGER NOT NULL DEFAULT 0,
    "max_selections" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "menu_modifier_options" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "modifier_group_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "restaurants_owner_id_idx" ON "restaurants"("owner_id");
CREATE INDEX IF NOT EXISTS "restaurants_cuisine_category_id_idx" ON "restaurants"("cuisine_category_id");
CREATE INDEX IF NOT EXISTS "menu_categories_restaurant_id_is_active_sort_order_idx" ON "menu_categories"("restaurant_id", "is_active", "sort_order");
CREATE INDEX IF NOT EXISTS "menu_items_menu_category_id_is_available_sort_order_idx" ON "menu_items"("menu_category_id", "is_available", "sort_order");
CREATE INDEX IF NOT EXISTS "menu_modifier_groups_menu_item_id_sort_order_idx" ON "menu_modifier_groups"("menu_item_id", "sort_order");
CREATE INDEX IF NOT EXISTS "menu_modifier_options_modifier_group_id_is_available_sort_order_idx" ON "menu_modifier_options"("modifier_group_id", "is_available", "sort_order");
