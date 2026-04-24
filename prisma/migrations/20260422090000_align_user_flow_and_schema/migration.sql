BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
    CREATE TYPE "Role" AS ENUM ('CLIENT', 'RIDER', 'PARTNER', 'ADMIN', 'OWNER');
  END IF;
END $$;

DO $$
BEGIN
  BEGIN
    ALTER TYPE "Role" RENAME VALUE 'LIVREUR' TO 'RIDER';
  EXCEPTION
    WHEN invalid_parameter_value OR undefined_object THEN NULL;
  END;

  BEGIN
    ALTER TYPE "Role" RENAME VALUE 'PROPRIETAIRE' TO 'OWNER';
  EXCEPTION
    WHEN invalid_parameter_value OR undefined_object THEN NULL;
  END;

  BEGIN
    ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'PARTNER';
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
END $$;

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "firstname" TEXT,
  ADD COLUMN IF NOT EXISTS "lastname" TEXT,
  ADD COLUMN IF NOT EXISTS "phone" TEXT,
  ADD COLUMN IF NOT EXISTS "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "verificationCodeHash" TEXT,
  ADD COLUMN IF NOT EXISTS "verificationCodeExpiresAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "resetPasswordToken" TEXT;

UPDATE "User"
SET
  "firstname" = COALESCE("firstname", NULLIF(split_part(COALESCE("name", ''), ' ', 1), '')),
  "lastname" = COALESCE("lastname", NULLIF(trim(substr(COALESCE("name", ''), length(split_part(COALESCE("name", ''), ' ', 1)) + 1)), '')),
  "isEmailVerified" = CASE
    WHEN "verificationCodeHash" IS NULL AND "verificationCodeExpiresAt" IS NULL THEN true
    ELSE "isEmailVerified"
  END;

CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone");

DROP TABLE IF EXISTS "Livraison" CASCADE;
DROP TABLE IF EXISTS "Menu" CASCADE;
DROP TABLE IF EXISTS "Restaurant" CASCADE;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'VehicleType' AND n.nspname = current_schema()
  ) THEN
    CREATE TYPE "VehicleType" AS ENUM ('MOTO', 'TAXI', 'CAMION_PETIT', 'CAMION_GRAND');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'DriverStatus' AND n.nspname = current_schema()
  ) THEN
    CREATE TYPE "DriverStatus" AS ENUM ('ACTIVE', 'WARNING', 'SUSPENDED', 'BANNED');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'PartnerType' AND n.nspname = current_schema()
  ) THEN
    CREATE TYPE "PartnerType" AS ENUM ('RESTAURANT', 'GAS_STORE');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'ProductType' AND n.nspname = current_schema()
  ) THEN
    CREATE TYPE "ProductType" AS ENUM ('PLAT', 'GAS_BOTTLE');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'ServiceType' AND n.nspname = current_schema()
  ) THEN
    CREATE TYPE "ServiceType" AS ENUM ('RESTAURANT', 'PACKAGE', 'GAS', 'TAXI', 'MOVING');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'OrderStatus' AND n.nspname = current_schema()
  ) THEN
    CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ACCEPTED', 'ROAD', 'COMPLETED', 'CANCELED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "DriverProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "typeVehicule" "VehicleType" NOT NULL,
  "plaque" TEXT,
  "isDisponible" BOOLEAN NOT NULL DEFAULT true,
  "status" "DriverStatus" NOT NULL DEFAULT 'ACTIVE',
  "position" JSONB,
  CONSTRAINT "DriverProfile_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "DriverProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "DriverProfile_userId_key" ON "DriverProfile"("userId");

CREATE TABLE IF NOT EXISTS "PartnerProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "PartnerType" NOT NULL,
  "StoreName" TEXT NOT NULL,
  "adress" TEXT,
  "position" JSONB,
  CONSTRAINT "PartnerProfile_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PartnerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "PartnerProfile_userId_key" ON "PartnerProfile"("userId");

CREATE TABLE IF NOT EXISTS "Menu" (
  "id" TEXT NOT NULL,
  "partnerProfileId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  CONSTRAINT "Menu_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Menu_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "PartnerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT NOT NULL,
  "partnerProfileId" TEXT NOT NULL,
  "menuId" TEXT,
  "type" "ProductType" NOT NULL,
  "name" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "label" TEXT,
  "formatKg" INTEGER,
  "stockFull" INTEGER,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Product_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "PartnerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Product_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "driverId" TEXT,
  "typeService" "ServiceType" NOT NULL,
  "statut" "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "totalAmount" DOUBLE PRECISION NOT NULL,
  "distanceKm" DOUBLE PRECISION,
  "loadedMassKg" DOUBLE PRECISION,
  "startingAdress" TEXT NOT NULL,
  "startingCoordinates" JSONB,
  "destinationAdress" TEXT,
  "destinationCoordinates" JSONB,
  "photoUrl" TEXT,
  "bottleCondition" TEXT,
  "hasExchange" BOOLEAN DEFAULT false,
  "detailsSpecifiques" JSONB,
  "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Order_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "DriverProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "unitPrice" DOUBLE PRECISION NOT NULL,
  CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Transaction" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "Amount" DOUBLE PRECISION NOT NULL,
  "serviceCost" DOUBLE PRECISION NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Transaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Transaction_orderId_key" ON "Transaction"("orderId");

CREATE TABLE IF NOT EXISTS "Incident" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "isResolved" BOOLEAN NOT NULL DEFAULT false,
  "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Incident_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Incident_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Sanction" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Sanction_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Sanction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Rating" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "note" INTEGER NOT NULL,
  "comment" TEXT,
  CONSTRAINT "Rating_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Rating_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Rating_orderId_key" ON "Rating"("orderId");

COMMIT;
