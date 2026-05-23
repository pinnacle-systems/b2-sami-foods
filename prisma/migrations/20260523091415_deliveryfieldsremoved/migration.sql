/*
  Warnings:

  - You are about to drop the column `deliveryPrice` on the `ProductMaster` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryqty` on the `ProductMaster` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryuomId` on the `ProductMaster` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductMaster" DROP CONSTRAINT "ProductMaster_deliveryuomId_fkey";

-- AlterTable
ALTER TABLE "ProductMaster" DROP COLUMN "deliveryPrice",
DROP COLUMN "deliveryqty",
DROP COLUMN "deliveryuomId";
