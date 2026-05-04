CREATE TABLE IF NOT EXISTS "InventoryAiReport" (
  "id" TEXT NOT NULL,
  "aiInsight" TEXT NOT NULL,
  "aiInsightModel" TEXT NOT NULL,
  "generatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InventoryAiReport_pkey" PRIMARY KEY ("id")
);
