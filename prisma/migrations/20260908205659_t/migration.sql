/*
  Warnings:

  - You are about to drop the column `category` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `WorkoutSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Template" DROP COLUMN "category";

-- AlterTable
ALTER TABLE "WorkoutSession" DROP COLUMN "category";

-- DropEnum
DROP TYPE "TemplateCategory";
