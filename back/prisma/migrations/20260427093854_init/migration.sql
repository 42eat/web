-- AlterTable
ALTER TABLE "shifts" ALTER COLUMN "discord_message_id" DROP NOT NULL,
ALTER COLUMN "validated" SET DEFAULT false;
