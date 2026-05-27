/*
  Warnings:

  - A unique constraint covering the columns `[graceTokenHash]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "graceTokenHash" TEXT,
ADD COLUMN     "graceUntil" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_graceTokenHash_key" ON "RefreshToken"("graceTokenHash");
