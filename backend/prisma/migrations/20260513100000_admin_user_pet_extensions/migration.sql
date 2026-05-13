-- Add soft delete to User
ALTER TABLE "User" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Add extended fields to Pet
ALTER TABLE "Pet" ADD COLUMN "archivedAt" TIMESTAMP(3);
ALTER TABLE "Pet" ADD COLUMN "birthday" TIMESTAMP(3);
ALTER TABLE "Pet" ADD COLUMN "weight" DOUBLE PRECISION;

-- Add modification reason to MedicalRecord
ALTER TABLE "MedicalRecord" ADD COLUMN "modificationReason" TEXT;
