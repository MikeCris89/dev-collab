/*
  Warnings:

  - You are about to drop the column `is_protected` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "is_protected" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_protected";
