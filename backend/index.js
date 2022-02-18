import express from "express";
import cors from "cors";
import db from "./db/db.js";
import dotenv from "dotenv";
import role from "./routes/roles.js";
import client from "./routes/clients.js";
import invoice from "./routes/invoices.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/role", role);
app.use("/api/client", client);
app.use("/api/invoice", invoice);

app.listen(process.env.PORT, () =>
  console.log(`Backend server running on port: ${process.env.PORT}`)
);

db.dbConnection();
