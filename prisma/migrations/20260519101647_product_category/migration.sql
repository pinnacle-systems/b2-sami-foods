/*
  Warnings:

  - The `ratings` column on the `ProductMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ProductMaster" DROP COLUMN "ratings",
ADD COLUMN     "ratings" INTEGER;
