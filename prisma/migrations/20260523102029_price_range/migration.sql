-- CreateTable
CREATE TABLE "PriceRange" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "uomId" INTEGER NOT NULL,
    "fromQty" DOUBLE PRECISION NOT NULL,
    "toQty" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceRange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PriceRange" ADD CONSTRAINT "PriceRange_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceRange" ADD CONSTRAINT "PriceRange_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "Uom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
