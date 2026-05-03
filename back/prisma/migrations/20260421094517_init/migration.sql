/*
  Warnings:

  - Added the required column `type_id` to the `shifts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shifts" ADD COLUMN     "type_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "shift_type" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "xp_mult" DOUBLE PRECISION DEFAULT 1,

    CONSTRAINT "shift_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shift_type_type_key" ON "shift_type"("type");

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "shift_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
