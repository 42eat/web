/*
  Warnings:

  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_parent_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permission_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_role_fkey";

-- DropForeignKey
ALTER TABLE "member_roles" DROP CONSTRAINT "member_roles_member_fkey";

-- DropForeignKey
ALTER TABLE "member_roles" DROP CONSTRAINT "member_roles_role_fkey";

-- DropForeignKey
ALTER TABLE "shift_assignment" DROP CONSTRAINT "shift_assignment_member_id_fkey";

-- AlterTable
ALTER TABLE "adhesion" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "expense_trip" ALTER COLUMN "trip_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "member_roles" ALTER COLUMN "member" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "password" TEXT,
ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "shift_assignment" ALTER COLUMN "member_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "shift_positions" ALTER COLUMN "xp_mult" DROP NOT NULL;

-- AlterTable
ALTER TABLE "vehicle" ALTER COLUMN "created_at" DROP DEFAULT;

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "RolePermission";

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "parent" INTEGER,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" SERIAL NOT NULL,
    "role" INTEGER NOT NULL,
    "permission" INTEGER NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_key" ON "roles"("role");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_parent_fkey" FOREIGN KEY ("parent") REFERENCES "permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_fkey" FOREIGN KEY ("role") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_fkey" FOREIGN KEY ("permission") REFERENCES "permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_roles" ADD CONSTRAINT "member_roles_member_fkey" FOREIGN KEY ("member") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_roles" ADD CONSTRAINT "member_roles_role_fkey" FOREIGN KEY ("role") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_assignment" ADD CONSTRAINT "shift_assignment_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
