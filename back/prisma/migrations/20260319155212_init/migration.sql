/*
  Warnings:

  - You are about to drop the column `member` on the `member_roles` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `member_roles` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `role_permissions` table. All the data in the column will be lost.
  - You are about to drop the `permission` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `member_id` to the `member_roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `member_roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `role_permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "member_roles" DROP CONSTRAINT "member_roles_member_fkey";

-- DropForeignKey
ALTER TABLE "member_roles" DROP CONSTRAINT "member_roles_role_fkey";

-- DropForeignKey
ALTER TABLE "permission" DROP CONSTRAINT "permission_parent_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permission_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_role_fkey";

-- AlterTable
ALTER TABLE "member_roles" DROP COLUMN "member",
DROP COLUMN "role",
ADD COLUMN     "member_id" INTEGER NOT NULL,
ADD COLUMN     "role_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "role_permissions" DROP COLUMN "role",
ADD COLUMN     "role_id" INTEGER NOT NULL,
ALTER COLUMN "permission" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "permission";

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_roles" ADD CONSTRAINT "member_roles_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_roles" ADD CONSTRAINT "member_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
