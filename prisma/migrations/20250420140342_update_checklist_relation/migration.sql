/*
  Warnings:

  - You are about to drop the column `taskId` on the `TaskChecklistItem` table. All the data in the column will be lost.
  - Added the required column `TaskChecklistId` to the `TaskChecklistItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TaskChecklistItem" DROP CONSTRAINT "TaskChecklistItem_taskId_fkey";

-- DropIndex
DROP INDEX "TaskChecklistItem_taskId_idx";

-- AlterTable
ALTER TABLE "TaskChecklistItem" DROP COLUMN "taskId",
ADD COLUMN     "TaskChecklistId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "TaskChecklistItem_TaskChecklistId_idx" ON "TaskChecklistItem"("TaskChecklistId");

-- AddForeignKey
ALTER TABLE "TaskChecklistItem" ADD CONSTRAINT "TaskChecklistItem_TaskChecklistId_fkey" FOREIGN KEY ("TaskChecklistId") REFERENCES "TaskChecklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
