/*
  Warnings:

  - A unique constraint covering the columns `[shift_id,member_id]` on the table `shift_members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discord_message_id]` on the table `shifts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[date,type_id]` on the table `shifts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "shift_members_shift_id_member_id_key" ON "shift_members"("shift_id", "member_id");

-- CreateIndex
CREATE UNIQUE INDEX "shifts_discord_message_id_key" ON "shifts"("discord_message_id");

-- CreateIndex
CREATE UNIQUE INDEX "shifts_date_type_id_key" ON "shifts"("date", "type_id");
