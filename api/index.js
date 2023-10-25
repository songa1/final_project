import express from "express";
import { getPower } from "./control/power.js";
import { addTransaction, getTransactions } from "./control/transaction.js";
import { addMeter, getMeters } from "./control/meter.js";
import cors from "cors";
import { login } from "./control/auth.js";

const app = express();

app.use(cors())
app.use(express.json());

app.get("/get-power", getPower);
app.get("/meters", getMeters);
app.get("/transactions", getTransactions);
app.get("/new-transaction", addTransaction);
app.post("/add-meter", addMeter);
app.post("/login", login);

app.listen(3456, function () {
  console.log("Express server listening on port 3456");
});

export default app;
