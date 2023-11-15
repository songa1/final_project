import { PrismaClient } from "@prisma/client";
import sendSMS from "./sms.js";
const prisma = new PrismaClient();

export const getPower = async (req, res) => {
  let power = await prisma.meter.findUnique({
    where: {
      meterNumber: req.query.meter
    }
  });

  res.status(200).send({ data: power });
};

export const reducePower = async (req, res) => {
  const { powerUsed, meterNumber } = req.query;

  const meter = await prisma.meter.findUnique({
    where: {
      meterNumber: meterNumber
    }
  })

  let newPower;
  if(powerUsed > meter.power){
    newPower = 0;
  } else {
    newPower = (meter.power) - Number(powerUsed);
    if(newPower < 0) {
      newPower = 0;
    }
  }
  try {

    let newP = await prisma.meter.update({
      where: {
        id: meter.id
      },
      data: {
        power: parseFloat((newPower).toFixed(2))
      }
    })
    
    if(newPower === 0 && meter.power !== 0){
      await sendSMS(meterNumber, `Your are out of energy credits. Recharge to be able to use electricity again. Use Web platform or USSD app to recharge.`);
    }

    res.status(201).send({ message: 'Power updated successfully!', status: 201, data: newP })
  }catch (error) {
    console.log(error.message);
  }
}
