/*
  Warnings:

  - You are about to drop the column `manager` on the `shifts` table. All the data in the column will be lost.
  - Added the required column `managerId` to the `shifts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reporter_id` to the `shifts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "shifts" DROP CONSTRAINT "shifts_manager_fkey";

-- AlterTable
ALTER TABLE "shifts" DROP COLUMN "manager",
ADD COLUMN     "managerId" INTEGER NOT NULL,
ADD COLUMN     "reporter_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
