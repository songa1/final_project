import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const admin = await prisma.meter.upsert({
    where: { id: 100 },
    update: {},
    create: {
      id:Number(100),
      meterNumber: 'Super Admin',
      power: 0,
      password: "P@$$w0rd",
      createdAt: new Date(),
      updatedAt: new Date()
    },
  })
  console.log({ admin })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })