import express from "express";
import { getPower, updatePower } from "./control/power.js";
import { addTransaction, getTransactions } from "./control/transaction.js";

const app = express();

app.use(express.json());

app.get('/get-power', getPower);

app.get('/transactions', getTransactions);

app.put('/update-power', updatePower);

app.post('/new-transaction', addTransaction);

app.listen(3456, function () {
    console.log("Express server listening on port 3456");
})