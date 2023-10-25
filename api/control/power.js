import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPower = async (req, res) => {
  let power = await prisma.meter.findUnique({
    where: {
      meterNumber: req.query.meter
    }
  });

  res.status(200).send({ data: power });
};
