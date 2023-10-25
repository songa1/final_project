import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addTransaction = async (req, res) => {
  const { amount, meter } = req.query;

  let meterData = await prisma.meter.findUnique({
    where: {
      meterNumber: meter
    }
  })

  // 1kwh equals to 125 RWF === 1RWF cost 0.008Kwh
  let power = parseFloat(amount * 0.008).toFixed(2);

  let transaction = await prisma.transaction.create({
    data: {
      amount: +amount,
      power: Number(power),
      meterId: meterData.id
    },
  });

  if(transaction){
    await prisma.meter.update({
      where: {
        meterNumber: meter,
      },
      data: {
        power: Number(power) + Number(meterData.power),
      },
    });
  }

  res
    .status(201)
    .send({ message: "Transaction added successfully!", data: transaction });
};

export const getTransactions = async (req, res) => {
  let transactions = await prisma.transaction.findMany();
  res.status(200).send({
    message: "Transactions fetched successfully!",
    data: transactions,
  });
};
