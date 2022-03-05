/*
  Warnings:

  - You are about to drop the column `title` on the `Debt` table. All the data in the column will be lost.
  - Added the required column `description` to the `Debt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Debt" DROP COLUMN "title",
ADD COLUMN     "description" TEXT NOT NULL;
