/*
  Warnings:

  - A unique constraint covering the columns `[meterNumber]` on the table `Meter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Meter_meterNumber_key" ON "Meter"("meterNumber");
