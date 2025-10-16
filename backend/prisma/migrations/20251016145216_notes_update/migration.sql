/*
  Warnings:

  - You are about to drop the column `project_id` on the `Note` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_folder_id_project_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_project_id_fkey";

-- DropIndex
DROP INDEX "public"."Note_project_id_folder_id_idx";

-- DropIndex
DROP INDEX "public"."Note_project_id_updated_at_idx";

-- AlterTable
ALTER TABLE "public"."Note" DROP COLUMN "project_id";

-- CreateIndex
CREATE INDEX "Note_folder_id_idx" ON "public"."Note"("folder_id");

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
