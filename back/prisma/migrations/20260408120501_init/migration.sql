-- AlterEnum
ALTER TYPE "TokenPurpose" ADD VALUE 'STATE_42AUTH';

-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "member_id" DROP NOT NULL;
