import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addMeter = async (req, res) => {
  let meter = await prisma.meter.create({
    data: {
      id: req.body.meter,
    },
  });

  res.status(201).send({ message: "Meter added successfully" });
};
