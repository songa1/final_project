import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addMeter = async (req, res) => {
  let meter = await prisma.meter.create({
    data: {
      meterNumber: req.body.meterNumber,
      power: req.body.power
    },
  });

  res.status(201).send({ message: "Meter added successfully" });
};
