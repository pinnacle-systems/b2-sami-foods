-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_productId_fkey";

-- CreateIndex
CREATE INDEX "Addresses_userId_idx" ON "Addresses"("userId");

-- CreateIndex
CREATE INDEX "ProductMaster_productStatus_idx" ON "ProductMaster"("productStatus");

-- CreateIndex
CREATE INDEX "ProductMaster_productCategoryId_idx" ON "ProductMaster"("productCategoryId");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
