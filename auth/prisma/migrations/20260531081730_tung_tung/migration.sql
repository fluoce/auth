/*
  Warnings:

  - You are about to drop the column `mobile` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_mobile_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "mobile",
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
