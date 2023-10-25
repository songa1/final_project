import express from "express";
import { getPower } from "./control/power.js";
import { addTransaction, getTransactions } from "./control/transaction.js";
import { addMeter } from "./control/meter.js";

const app = express();

app.use(express.json());

app.get("/get-power", getPower);

app.get("/transactions", getTransactions);

app.get("/new-transaction", addTransaction);

app.post("/add-meter", addMeter);

app.listen(3456, function () {
  console.log("Express server listening on port 3456");
});

export default app;
