-- Add onboarding fields for mobile pet owner flow
ALTER TABLE "User"
ADD COLUMN "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "lastOtpVerified" TIMESTAMP(3);

-- Enforce unique phone number across accounts
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
