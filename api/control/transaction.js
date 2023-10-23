import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addTransaction = async (req, res) => {
  const { amount, power } = req.body;
  let transaction = await prisma.transaction.create({
    data: {
      amount: amount,
      power: power,
    },
  });

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