/*
  Warnings:

  - You are about to drop the column `isDisponible` on the `DriverProfile` table. All the data in the column will be lost.
  - You are about to drop the column `plaque` on the `DriverProfile` table. All the data in the column will be lost.
  - You are about to drop the column `typeVehicule` on the `DriverProfile` table. All the data in the column will be lost.
  - You are about to drop the column `partnerProfileId` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `bottleCondition` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `creationDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `destinationAdress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `destinationCoordinates` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `detailsSpecifiques` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `distanceKm` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `hasExchange` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `loadedMassKg` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `startingAdress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `startingCoordinates` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `statut` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `typeService` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `creationDate` on the `Sanction` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Sanction` table. All the data in the column will be lost.
  - You are about to drop the `Incident` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PartnerProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `DriverProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleType` to the `DriverProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partnerId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Sanction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SanctionType" AS ENUM ('WARNING', 'SUSPENSION', 'BAN');

-- DropForeignKey
ALTER TABLE "DriverProfile" DROP CONSTRAINT "DriverProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_partnerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "PartnerProfile" DROP CONSTRAINT "PartnerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_menuId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_partnerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Sanction" DROP CONSTRAINT "Sanction_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_orderId_fkey";

-- AlterTable
ALTER TABLE "DriverProfile" DROP COLUMN "isDisponible",
DROP COLUMN "plaque",
DROP COLUMN "typeVehicule",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "licensePlate" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vehicleType" "VehicleType" NOT NULL;

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "partnerProfileId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "restaurantId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "bottleCondition",
DROP COLUMN "creationDate",
DROP COLUMN "destinationAdress",
DROP COLUMN "destinationCoordinates",
DROP COLUMN "detailsSpecifiques",
DROP COLUMN "distanceKm",
DROP COLUMN "hasExchange",
DROP COLUMN "loadedMassKg",
DROP COLUMN "photoUrl",
DROP COLUMN "startingAdress",
DROP COLUMN "startingCoordinates",
DROP COLUMN "statut",
DROP COLUMN "typeService",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliveryAddress" TEXT NOT NULL,
ADD COLUMN     "deliveryPosition" JSONB,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "partnerId" TEXT NOT NULL,
ADD COLUMN     "serviceType" "ServiceType" NOT NULL,
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "productId",
ADD COLUMN     "dishId" TEXT,
ADD COLUMN     "gasBottleId" TEXT;

-- AlterTable
ALTER TABLE "Sanction" DROP COLUMN "creationDate",
DROP COLUMN "isActive",
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "type",
ADD COLUMN     "type" "SanctionType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPasswordExpiresAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Incident";

-- DropTable
DROP TABLE "PartnerProfile";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "Rating";

-- DropTable
DROP TABLE "Transaction";

-- DropEnum
DROP TYPE "ProductType";

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PartnerType" NOT NULL,
    "storeName" TEXT NOT NULL,
    "address" TEXT,
    "position" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "cuisineType" TEXT,
    "openingTime" TEXT,
    "closingTime" TEXT,
    "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minOrderAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GasStore" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "availableBrands" TEXT[],
    "hasDelivery" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GasStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dish" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuDish" (
    "menuId" TEXT NOT NULL,
    "dishId" TEXT NOT NULL,

    CONSTRAINT "MenuDish_pkey" PRIMARY KEY ("menuId","dishId")
);

-- CreateTable
CREATE TABLE "GasBottle" (
    "id" TEXT NOT NULL,
    "gasStoreId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GasBottle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Partner_userId_key" ON "Partner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_partnerId_key" ON "Restaurant"("partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "GasStore_partnerId_key" ON "GasStore"("partnerId");

-- AddForeignKey
ALTER TABLE "DriverProfile" ADD CONSTRAINT "DriverProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GasStore" ADD CONSTRAINT "GasStore_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuDish" ADD CONSTRAINT "MenuDish_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuDish" ADD CONSTRAINT "MenuDish_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GasBottle" ADD CONSTRAINT "GasBottle_gasStoreId_fkey" FOREIGN KEY ("gasStoreId") REFERENCES "GasStore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_gasBottleId_fkey" FOREIGN KEY ("gasBottleId") REFERENCES "GasBottle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sanction" ADD CONSTRAINT "Sanction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
