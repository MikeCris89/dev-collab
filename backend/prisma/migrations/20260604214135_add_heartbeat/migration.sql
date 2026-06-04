-- CreateTable
CREATE TABLE "heartbeats" (
    "id" TEXT NOT NULL,
    "ran_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_teams" INTEGER NOT NULL,
    "deleted_demo_teams" INTEGER NOT NULL,
    "total_teams" INTEGER NOT NULL,
    "total_demo_teams" INTEGER NOT NULL,

    CONSTRAINT "heartbeats_pkey" PRIMARY KEY ("id")
);
