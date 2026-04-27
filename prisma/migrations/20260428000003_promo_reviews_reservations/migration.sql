-- Migration: promo + avis + réservations
-- Description: Création des tables PromoCode, Review et TableReservation.

CREATE TABLE IF NOT EXISTS "promo_codes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "discount_type" TEXT NOT NULL,
    "discount_value" DOUBLE PRECISION NOT NULL,
    "minimum_order" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maximum_discount" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "usage_limit" INTEGER,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "per_user_limit" INTEGER NOT NULL DEFAULT 1,
    "valid_from" TIMESTAMPTZ NOT NULL,
    "valid_until" TIMESTAMPTZ NOT NULL,
    "applicable_restaurants" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "applicable_categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "customer_id" UUID NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "response" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "helpful_count" INTEGER NOT NULL DEFAULT 0,
    "reviewed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "table_reservations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reservation_number" TEXT NOT NULL UNIQUE,
    "customer_id" UUID NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "party_size" INTEGER NOT NULL,
    "reservation_date" TIMESTAMPTZ NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 120,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "special_requests" TEXT,
    "customer_phone" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "table_number" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "confirmed_at" TIMESTAMPTZ,
    "cancelled_at" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "promo_codes_code_idx" ON "promo_codes"("code");
CREATE INDEX IF NOT EXISTS "promo_codes_is_active_valid_until_idx" ON "promo_codes"("is_active", "valid_until");
CREATE INDEX IF NOT EXISTS "promo_codes_usage_count_usage_limit_idx" ON "promo_codes"("usage_count", "usage_limit");
CREATE INDEX IF NOT EXISTS "reviews_order_id_idx" ON "reviews"("order_id");
CREATE INDEX IF NOT EXISTS "reviews_customer_id_reviewed_at_idx" ON "reviews"("customer_id", "reviewed_at");
CREATE INDEX IF NOT EXISTS "reviews_restaurant_id_rating_reviewed_at_idx" ON "reviews"("restaurant_id", "rating", "reviewed_at");
CREATE INDEX IF NOT EXISTS "table_reservations_customer_id_reservation_date_idx" ON "table_reservations"("customer_id", "reservation_date");
CREATE INDEX IF NOT EXISTS "table_reservations_restaurant_id_reservation_date_status_idx" ON "table_reservations"("restaurant_id", "reservation_date", "status");
CREATE INDEX IF NOT EXISTS "table_reservations_reservation_number_idx" ON "table_reservations"("reservation_number");
CREATE INDEX IF NOT EXISTS "table_reservations_status_reservation_date_idx" ON "table_reservations"("status", "reservation_date");
