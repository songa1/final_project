import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPower = async (req, res) => {
  let power = await prisma.power.findFirst();

  res.status(200).send({ data: power });
};

export const createPower = async (req, res) => {
  const { power, meterId } = req.body;

  await prisma.power.create({
    data: {
      power: Number(power),
      meterId: meterId,
    },
  });

  res.status(201).send({ message: "Created successfully!" });
};

export const updatePower = async (req, res) => {
  const { power, powerId } = req.body;

  await prisma.power.update({
    where: {
      id: powerId,
    },
    data: {
      power: Number(power),
    },
  });

  res.status(201).send({ message: "Updated successfully!" });
};
