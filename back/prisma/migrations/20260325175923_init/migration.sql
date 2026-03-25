-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "default_role" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "display_color" TEXT;
