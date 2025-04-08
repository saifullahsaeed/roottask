/*
  Warnings:

  - Added the required column `projectId` to the `TaskStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskStatus" ADD COLUMN     "projectId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TaskStatus" ADD CONSTRAINT "TaskStatus_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
