/*
  Warnings:

  - You are about to drop the column `order_number` on the `food_orders` table. All the data in the column will be lost.
  - You are about to drop the column `order_type` on the `food_orders` table. All the data in the column will be lost.
  - You are about to drop the column `close_time` on the `opening_hours` table. All the data in the column will be lost.
  - You are about to drop the column `day_of_week` on the `opening_hours` table. All the data in the column will be lost.
  - You are about to drop the column `open_time` on the `opening_hours` table. All the data in the column will be lost.
  - You are about to drop the column `discount_type` on the `promo_codes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderNumber]` on the table `food_orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[restaurant_id,dayOfWeek]` on the table `opening_hours` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `restaurants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rccm]` on the table `restaurants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderNumber` to the `food_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closeTime` to the `opening_hours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayOfWeek` to the `opening_hours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openTime` to the `opening_hours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountType` to the `promo_codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'REFUNDED';

-- DropIndex
DROP INDEX "food_orders_order_number_key";

-- DropIndex
DROP INDEX "opening_hours_restaurant_id_day_of_week_idx";

-- DropIndex
DROP INDEX "opening_hours_restaurant_id_day_of_week_key";

-- AlterTable
ALTER TABLE "cuisine_categories" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "delivery_zones" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "food_orders" DROP COLUMN "order_number",
DROP COLUMN "order_type",
ADD COLUMN     "orderNumber" TEXT NOT NULL,
ADD COLUMN     "orderType" "OrderType" NOT NULL DEFAULT 'DELIVERY',
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "menu_categories" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "menu_items" ALTER COLUMN "allergens" DROP DEFAULT,
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
ALTER TABLE "restaurants" ADD COLUMN     "rccm" TEXT,
ADD COLUMN     "slug" TEXT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "table_reservations" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "food_orders_orderNumber_key" ON "food_orders"("orderNumber");

-- CreateIndex
CREATE INDEX "food_orders_status_ordered_at_idx" ON "food_orders"("status", "ordered_at");

-- CreateIndex
CREATE INDEX "food_orders_orderNumber_idx" ON "food_orders"("orderNumber");

-- CreateIndex
CREATE INDEX "opening_hours_restaurant_id_dayOfWeek_idx" ON "opening_hours"("restaurant_id", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "opening_hours_restaurant_id_dayOfWeek_key" ON "opening_hours"("restaurant_id", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_slug_key" ON "restaurants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_rccm_key" ON "restaurants"("rccm");

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
