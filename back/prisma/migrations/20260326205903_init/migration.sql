/*
  Warnings:

  - You are about to drop the column `displayName` on the `members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "displayName",
ADD COLUMN     "display_name" TEXT;
