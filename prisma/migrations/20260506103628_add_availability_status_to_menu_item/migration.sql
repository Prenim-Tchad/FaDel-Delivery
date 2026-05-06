-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'HIDDEN', 'OUT_OF_STOCK');

-- AlterTable
ALTER TABLE "menu_items" ADD COLUMN     "availability_status" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
