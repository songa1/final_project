/*
  Warnings:

  - You are about to alter the column `power` on the `Meter` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Meter" ALTER COLUMN "power" SET DATA TYPE DOUBLE PRECISION;
