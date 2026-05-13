-- Make ActivityLog.staffId optional
ALTER TABLE "ActivityLog" ALTER COLUMN "staffId" DROP NOT NULL;

-- Create ClinicSettings table
CREATE TABLE "ClinicSettings" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "openTime" TEXT NOT NULL DEFAULT '08:00',
    "closeTime" TEXT NOT NULL DEFAULT '17:00',
    "breakStart" TEXT,
    "breakEnd" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicSettings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ClinicSettings_dayOfWeek_key" ON "ClinicSettings"("dayOfWeek");
