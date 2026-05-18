-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "productCategoryImage" TEXT,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductMaster" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "productImage" TEXT,
    "productCategoryId" INTEGER NOT NULL,
    "productLabel" TEXT,
    "productDesc" TEXT,
    "productPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "originalPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discountPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "productStatus" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProductMaster_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductMaster" ADD CONSTRAINT "ProductMaster_productCategoryId_fkey" FOREIGN KEY ("productCategoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
