-- AlterTable
ALTER TABLE "TaskComment" ADD COLUMN     "attachments" JSONB,
ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mentions" TEXT[],
ADD COLUMN     "parentId" TEXT;

-- CreateTable
CREATE TABLE "TaskCommentLike" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskCommentLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskCommentLike_commentId_idx" ON "TaskCommentLike"("commentId");

-- CreateIndex
CREATE INDEX "TaskCommentLike_userId_idx" ON "TaskCommentLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskCommentLike_commentId_userId_key" ON "TaskCommentLike"("commentId", "userId");

-- CreateIndex
CREATE INDEX "TaskComment_parentId_idx" ON "TaskComment"("parentId");

-- AddForeignKey
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "TaskComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskCommentLike" ADD CONSTRAINT "TaskCommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "TaskComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
