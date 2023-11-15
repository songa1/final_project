import { PrismaClient } from "@prisma/client";
import sendSMS from "./sms.js";
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
    let newPower = (Number(power) + Number(meterData.power)).toFixed(2);
    let upData = await prisma.meter.update({
      where: {
        meterNumber: meter,
      },
      data: {
        power: parseFloat(newPower)
      },
    });
    await sendSMS(meter, `Your recharge is successful. You have been given ${power} Kwh. Your new balance is ${upData.power} Kwh.`);
  }

  res
    .status(201)
    .send({ status: 201, message: "Transaction added successfully!", data: transaction });
};

export const getTransactions = async (req, res) => {
  let meterData = await prisma.meter.findUnique({
    where: {
      meterNumber: req.query.meter
    }
  })

  let transactions = await prisma.transaction.findMany({
    where: {
      meterId: meterData.id
    },
    orderBy: {
      id: "desc"
    }
  });

  res.status(200).send({
    message: "Transactions fetched successfully!",
    data: transactions,
  });
};
