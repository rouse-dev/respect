-- DropForeignKey
ALTER TABLE "HistoryRep" DROP CONSTRAINT "HistoryRep_lessonId_fkey";

-- AddForeignKey
ALTER TABLE "HistoryRep" ADD CONSTRAINT "HistoryRep_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
