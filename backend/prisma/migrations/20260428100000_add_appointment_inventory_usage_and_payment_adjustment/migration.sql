-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "adjustmentReason" TEXT;

-- CreateTable
CREATE TABLE "AppointmentInventoryUsage" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "quantityUsed" INTEGER NOT NULL,
    "unitCostSnapshot" DECIMAL(10,2) NOT NULL,
    "lineTotal" DECIMAL(10,2) NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentInventoryUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentInventoryUsage_appointmentId_idx" ON "AppointmentInventoryUsage"("appointmentId");

-- CreateIndex
CREATE INDEX "AppointmentInventoryUsage_inventoryItemId_idx" ON "AppointmentInventoryUsage"("inventoryItemId");

-- AddForeignKey
ALTER TABLE "AppointmentInventoryUsage" ADD CONSTRAINT "AppointmentInventoryUsage_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentInventoryUsage" ADD CONSTRAINT "AppointmentInventoryUsage_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentInventoryUsage" ADD CONSTRAINT "AppointmentInventoryUsage_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
