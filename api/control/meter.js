import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addMeter = async (req, res) => {
  let meter = await prisma.meter.create({
    data: {
      meterNumber: req.query.meterNumber,
      power: Number(req.query.power),
      password: req.query.password
    },
  });

  res.status(201).send({ status: 201, message: "Meter added successfully" });
};

export const getMeters = async(req, res) => {
  let meters = await prisma.meter.findMany({orderBy: {id: "desc"}});
  res.status(200).send({ status: 200, data: meters });
}