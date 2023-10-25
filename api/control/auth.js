import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const login = async(req, res) => {
    let { username, password } = req.query;

    if(!username || !password) {
        res.status(400).send({ status: 400, message: "Credentials missing" });
    }else {
        let meter = await prisma.meter.findUnique({
            where: {
                meterNumber: username
            }
        })
        if(meter){
            try {
                if(meter.id === 100){
                    let token = `123##${meter.meterNumber}##456`;
                    res.status(200).send({ status: "admin", meter: meter, token })
                    return;
                }
                let token = `123**${meter.meterNumber}**456`;
                res.status(200).send({ status: 200, token, meter });
            } catch (error) {
                console.log(error.message);
            }
        } else {
            res.status(404).send({ status: 404, message: 'No meter found'});
        }
    }
}