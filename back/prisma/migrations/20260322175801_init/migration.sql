/*
  Warnings:

  - A unique constraint covering the columns `[role_id,permission]` on the table `role_permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_key" ON "role_permissions"("role_id", "permission");
