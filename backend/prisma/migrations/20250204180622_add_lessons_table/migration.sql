-- AlterTable
ALTER TABLE "HistoryRep" ADD COLUMN     "lessonId" INTEGER;

-- CreateTable
CREATE TABLE "Lessons" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lessons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HistoryRep" ADD CONSTRAINT "HistoryRep_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
