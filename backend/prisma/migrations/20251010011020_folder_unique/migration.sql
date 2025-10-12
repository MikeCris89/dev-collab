/*
  Warnings:

  - A unique constraint covering the columns `[id,team_id]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Project_team_id_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Project_id_team_id_key" ON "public"."Project"("id", "team_id");
