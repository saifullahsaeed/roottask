/*
  Warnings:

  - You are about to drop the column `attachments` on the `TaskComment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TaskAttachment" ADD COLUMN     "commentId" TEXT;

-- AlterTable
ALTER TABLE "TaskComment" DROP COLUMN "attachments";

-- CreateIndex
CREATE INDEX "TaskAttachment_commentId_idx" ON "TaskAttachment"("commentId");

-- AddForeignKey
ALTER TABLE "TaskAttachment" ADD CONSTRAINT "TaskAttachment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "TaskComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
