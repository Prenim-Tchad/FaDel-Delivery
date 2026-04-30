/*
  Warnings:

  - The `description` column on the `menu_categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `close_time` on the `opening_hours` table. All the data in the column will be lost.
  - You are about to drop the column `day_of_week` on the `opening_hours` table. All the data in the column will be lost.
  - You are about to drop the column `open_time` on the `opening_hours` table. All the data in the column will be lost.
  - You are about to drop the column `discount_type` on the `promo_codes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[restaurant_id,dayOfWeek]` on the table `opening_hours` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `name` on the `menu_categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `closeTime` to the `opening_hours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayOfWeek` to the `opening_hours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openTime` to the `opening_hours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountType` to the `promo_codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'REFUNDED';

-- DropIndex
DROP INDEX "opening_hours_restaurant_id_day_of_week_idx";

-- DropIndex
DROP INDEX "opening_hours_restaurant_id_day_of_week_key";

-- AlterTable
ALTER TABLE "cuisine_categories" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "delivery_zones" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "food_orders" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "menu_categories" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "name",
ADD COLUMN     "name" JSONB NOT NULL,
DROP COLUMN "description",
ADD COLUMN     "description" JSONB,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "menu_items" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_popular" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "allergens" DROP DEFAULT,
ALTER COLUMN "ingredients" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "menu_modifier_groups" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "menu_modifier_options" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "opening_hours" DROP COLUMN "close_time",
DROP COLUMN "day_of_week",
DROP COLUMN "open_time",
ADD COLUMN     "closeTime" TEXT NOT NULL,
ADD COLUMN     "dayOfWeek" INTEGER NOT NULL,
ADD COLUMN     "openTime" TEXT NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "order_item_options" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "promo_codes" DROP COLUMN "discount_type",
ADD COLUMN     "discountType" TEXT NOT NULL,
ALTER COLUMN "applicable_restaurants" DROP DEFAULT,
ALTER COLUMN "applicable_categories" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "restaurants" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "table_reservations" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "food_orders_status_ordered_at_idx" ON "food_orders"("status", "ordered_at");

-- CreateIndex
CREATE INDEX "food_orders_order_number_idx" ON "food_orders"("order_number");

-- CreateIndex
CREATE INDEX "menu_categories_restaurant_id_is_deleted_idx" ON "menu_categories"("restaurant_id", "is_deleted");

-- CreateIndex
CREATE INDEX "menu_items_menu_category_id_is_deleted_idx" ON "menu_items"("menu_category_id", "is_deleted");

-- CreateIndex
CREATE INDEX "menu_items_is_popular_idx" ON "menu_items"("is_popular");

-- CreateIndex
CREATE INDEX "opening_hours_restaurant_id_dayOfWeek_idx" ON "opening_hours"("restaurant_id", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "opening_hours_restaurant_id_dayOfWeek_key" ON "opening_hours"("restaurant_id", "dayOfWeek");

-- CreateIndex
CREATE INDEX "reviews_is_verified_is_public_idx" ON "reviews"("is_verified", "is_public");

-- AddForeignKey
ALTER TABLE "food_orders" ADD CONSTRAINT "food_orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_orders" ADD CONSTRAINT "food_orders_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_orders" ADD CONSTRAINT "food_orders_promo_code_id_fkey" FOREIGN KEY ("promo_code_id") REFERENCES "promo_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_orders" ADD CONSTRAINT "food_orders_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "food_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_options" ADD CONSTRAINT "order_item_options_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_options" ADD CONSTRAINT "order_item_options_modifier_option_id_fkey" FOREIGN KEY ("modifier_option_id") REFERENCES "menu_modifier_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "food_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "table_reservations" ADD CONSTRAINT "table_reservations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "table_reservations" ADD CONSTRAINT "table_reservations_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "menu_items_dietary_filters_idx" RENAME TO "menu_items_is_vegetarian_is_vegan_is_halal_idx";

-- RenameIndex
ALTER INDEX "menu_modifier_options_modifier_group_id_is_available_sort_order" RENAME TO "menu_modifier_options_modifier_group_id_is_available_sort_o_idx";
