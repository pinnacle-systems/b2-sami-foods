/*
  Warnings:

  - You are about to alter the column `productPrice` on the `ProductMaster` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `originalPrice` on the `ProductMaster` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `discountPrice` on the `ProductMaster` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "ProductMaster" ALTER COLUMN "productPrice" DROP DEFAULT,
ALTER COLUMN "productPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "originalPrice" DROP NOT NULL,
ALTER COLUMN "originalPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "discountPrice" DROP NOT NULL,
ALTER COLUMN "discountPrice" SET DATA TYPE DOUBLE PRECISION;
