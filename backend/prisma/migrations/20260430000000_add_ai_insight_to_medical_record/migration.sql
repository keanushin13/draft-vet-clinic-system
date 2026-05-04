-- AlterTable: add AI insight caching columns to MedicalRecord
ALTER TABLE "MedicalRecord"
  ADD COLUMN IF NOT EXISTS "aiInsight" TEXT,
  ADD COLUMN IF NOT EXISTS "aiInsightModel" TEXT,
  ADD COLUMN IF NOT EXISTS "aiInsightGeneratedAt" TIMESTAMP(3);
