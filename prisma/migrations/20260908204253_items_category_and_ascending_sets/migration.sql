/*
  Warnings:

  - Added the required column `category` to the `SessionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `TemplateItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Category" ADD VALUE 'abdo';
ALTER TYPE "Category" ADD VALUE 'dos';

-- AlterTable
ALTER TABLE "SessionItem" ADD COLUMN     "ascendingSets" JSONB,
ADD COLUMN     "category" "Category" NOT NULL;

-- AlterTable
ALTER TABLE "TemplateItem" ADD COLUMN     "ascendingSets" JSONB,
ADD COLUMN     "category" "Category" NOT NULL;
