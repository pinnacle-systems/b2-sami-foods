-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastName" TEXT;

-- CreateTable
CREATE TABLE "Addresses" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "mobile" TEXT,
    "alterNateMobile" TEXT,
    "pinCode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "address" TEXT,
    "landMark" TEXT,
    "addressType" TEXT,
    "userId" INTEGER,

    CONSTRAINT "Addresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
