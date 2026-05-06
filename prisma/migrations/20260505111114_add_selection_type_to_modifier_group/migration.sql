-- CreateEnum
CREATE TYPE "SelectionType" AS ENUM ('SINGLE', 'MULTIPLE');

-- AlterTable
ALTER TABLE "menu_modifier_groups" ADD COLUMN "selection_type" "SelectionType" NOT NULL DEFAULT 'SINGLE';
