/*
  Warnings:

  - A unique constraint covering the columns `[member_id,role_id]` on the table `member_roles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "member_roles_member_id_role_id_key" ON "member_roles"("member_id", "role_id");
