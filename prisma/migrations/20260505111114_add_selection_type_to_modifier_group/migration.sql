/*
  Warnings:

  - You are about to drop the column `customer_name` on the `food_orders` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SelectionType" AS ENUM ('SINGLE', 'MULTIPLE');

-- AlterTable
ALTER TABLE "food_orders" DROP COLUMN "customer_name";

-- AlterTable
ALTER TABLE "menu_modifier_groups" ADD COLUMN     "selection_type" "SelectionType" NOT NULL DEFAULT 'SINGLE';
