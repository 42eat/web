/*
  Warnings:

  - Made the column `email` on table `members` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "members" ALTER COLUMN "email" SET NOT NULL;
