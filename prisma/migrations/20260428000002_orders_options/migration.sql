-- Migration: commandes + options
-- Description: Création des tables FoodOrder, OrderItem et OrderItemOption.
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED');
CREATE TYPE "OrderType" AS ENUM ('DELIVERY', 'TAKEOUT', 'DINE_IN');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'MOBILE_MONEY', 'BANK_TRANSFER');


CREATE TABLE IF NOT EXISTS "food_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_number" TEXT NOT NULL UNIQUE,
    "customer_id" UUID NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "order_type" "OrderType" NOT NULL DEFAULT 'DELIVERY',
    "delivery_address" TEXT,
    "delivery_latitude" DOUBLE PRECISION,
    "delivery_longitude" DOUBLE PRECISION,
    "delivery_notes" TEXT,
    "customer_phone" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "delivery_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "service_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_method" "PaymentMethod",
    "payment_reference" TEXT,
    "promo_code_id" TEXT,
    "ordered_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMPTZ,
    "ready_at" TIMESTAMPTZ,
    "delivered_at" TIMESTAMPTZ,
    "estimated_delivery" TIMESTAMPTZ,
    "rider_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "order_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "menu_item_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "base_price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "special_instructions" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "order_item_options" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_item_id" TEXT NOT NULL,
    "modifier_option_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "food_orders_customer_id_ordered_at_idx" ON "food_orders"("customer_id", "ordered_at");
CREATE INDEX IF NOT EXISTS "food_orders_restaurant_id_status_ordered_at_idx" ON "food_orders"("restaurant_id", "status", "ordered_at");
CREATE INDEX IF NOT EXISTS "food_orders_rider_id_status_idx" ON "food_orders"("rider_id", "status");
CREATE INDEX IF NOT EXISTS "order_items_order_id_idx" ON "order_items"("order_id");
CREATE INDEX IF NOT EXISTS "order_items_menu_item_id_idx" ON "order_items"("menu_item_id");
CREATE INDEX IF NOT EXISTS "order_item_options_order_item_id_idx" ON "order_item_options"("order_item_id");
CREATE INDEX IF NOT EXISTS "order_item_options_modifier_option_id_idx" ON "order_item_options"("modifier_option_id");
