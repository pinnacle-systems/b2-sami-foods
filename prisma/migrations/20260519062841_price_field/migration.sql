/*
  Warnings:

  - Made the column `originalPrice` on table `ProductMaster` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProductMaster" ALTER COLUMN "productPrice" DROP NOT NULL,
ALTER COLUMN "originalPrice" SET NOT NULL,
ALTER COLUMN "originalPrice" DROP DEFAULT,
ALTER COLUMN "discountPrice" DROP DEFAULT;
