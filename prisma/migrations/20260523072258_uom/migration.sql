-- AlterTable
ALTER TABLE "Addresses" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ProductMaster" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliveryPrice" DOUBLE PRECISION,
ADD COLUMN     "deliveryqty" DOUBLE PRECISION,
ADD COLUMN     "deliveryuomId" INTEGER,
ADD COLUMN     "productqty" DOUBLE PRECISION,
ADD COLUMN     "productuomId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Wishlist" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Uom" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Uom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductMaster" ADD CONSTRAINT "ProductMaster_productuomId_fkey" FOREIGN KEY ("productuomId") REFERENCES "Uom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMaster" ADD CONSTRAINT "ProductMaster_deliveryuomId_fkey" FOREIGN KEY ("deliveryuomId") REFERENCES "Uom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
