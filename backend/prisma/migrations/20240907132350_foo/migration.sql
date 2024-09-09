-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('READER', 'AUTHOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'READER';
