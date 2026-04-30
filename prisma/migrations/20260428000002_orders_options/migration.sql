-- Migration: commandes + options
-- Description: Création des tables FoodOrder, OrderItem et OrderItemOption.

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMs
CREATE TYPE "OrderStatus"   AS ENUM ('PENDING','CONFIRMED','PREPARING','READY','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','REFUNDED');
CREATE TYPE "OrderType"     AS ENUM ('DELIVERY','TAKEOUT','DINE_IN');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING','PAID','FAILED');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH','CARD','MOBILE_MONEY','BANK_TRANSFER');

-- Table principale des commandes
CREATE TABLE IF NOT EXISTS "food_orders" (
    "id"                  TEXT        NOT NULL PRIMARY KEY,
    "order_number"        TEXT        NOT NULL UNIQUE,

    -- Parties prenantes
    "customer_id"         TEXT        NOT NULL,  -- cohérent avec TEXT id
    "restaurant_id"       TEXT        NOT NULL,
    "rider_id"            TEXT,

    -- Statut & type
    "status"              "OrderStatus"   NOT NULL DEFAULT 'PENDING',
    "order_type"          "OrderType"     NOT NULL DEFAULT 'DELIVERY',

    -- Livraison
    "delivery_address"    TEXT,
    "delivery_latitude"   DOUBLE PRECISION,
    "delivery_longitude"  DOUBLE PRECISION,
    "delivery_notes"      TEXT,

    -- Client
    "customer_phone"      TEXT        NOT NULL,
    "customer_name"       TEXT        NOT NULL,

    -- Montants
    "subtotal"            DOUBLE PRECISION NOT NULL DEFAULT 0,
    "delivery_fee"        DOUBLE PRECISION NOT NULL DEFAULT 0,
    "service_fee"         DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount_amount"     DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_amount"        DOUBLE PRECISION NOT NULL DEFAULT 0,

    -- Paiement
    "payment_status"      "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_method"      "PaymentMethod",
    "payment_reference"   TEXT,
    "promo_code_id"       TEXT,

    -- Horodatages métier
    "ordered_at"          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at"        TIMESTAMPTZ,
    "ready_at"            TIMESTAMPTZ,
    "delivered_at"        TIMESTAMPTZ,
    "estimated_delivery"  TIMESTAMPTZ,

    -- Audit
    "created_at"          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP  -- ✅ corrigé
);

-- Table des articles de commande
CREATE TABLE IF NOT EXISTS "order_items" (
    "id"                    TEXT             NOT NULL PRIMARY KEY,
    "order_id"              TEXT             NOT NULL,
    "menu_item_id"          TEXT             NOT NULL,
    "name"                  TEXT             NOT NULL,
    "base_price"            DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quantity"              INTEGER          NOT NULL DEFAULT 1,
    "unit_price"            DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_price"           DOUBLE PRECISION NOT NULL DEFAULT 0,
    "special_instructions"  TEXT,
    "created_at"            TIMESTAMPTZ      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"            TIMESTAMPTZ      NOT NULL DEFAULT CURRENT_TIMESTAMP  -- ✅ corrigé
);

-- Table des options d'articles
CREATE TABLE IF NOT EXISTS "order_item_options" (
    "id"                  TEXT             NOT NULL PRIMARY KEY,
    "order_item_id"       TEXT             NOT NULL,
    "modifier_option_id"  TEXT             NOT NULL,
    "name"                TEXT             NOT NULL,
    "price"               DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at"          TIMESTAMPTZ      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"          TIMESTAMPTZ      NOT NULL DEFAULT CURRENT_TIMESTAMP  -- ✅ corrigé
);

-- ─── Clés étrangères ────────────────────────────────────────────────────────
ALTER TABLE "order_items"
    ADD CONSTRAINT "fk_order_items_order"
    FOREIGN KEY ("order_id")
    REFERENCES "food_orders"("id")
    ON DELETE CASCADE;

ALTER TABLE "order_item_options"
    ADD CONSTRAINT "fk_order_item_options_item"
    FOREIGN KEY ("order_item_id")
    REFERENCES "order_items"("id")
    ON DELETE CASCADE;

-- ─── Index ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS "food_orders_customer_id_ordered_at_idx"
    ON "food_orders"("customer_id", "ordered_at");

CREATE INDEX IF NOT EXISTS "food_orders_restaurant_id_status_ordered_at_idx"
    ON "food_orders"("restaurant_id", "status", "ordered_at");

CREATE INDEX IF NOT EXISTS "food_orders_rider_id_status_idx"
    ON "food_orders"("rider_id", "status");

CREATE INDEX IF NOT EXISTS "order_items_order_id_idx"
    ON "order_items"("order_id");

-- Index supplémentaire recommandé
CREATE INDEX IF NOT EXISTS "food_orders_status_idx"
    ON "food_orders"("status");

CREATE INDEX IF NOT EXISTS "food_orders_payment_status_idx"
    ON "food_orders"("payment_status");