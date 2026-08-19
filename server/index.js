import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cryptoRates from "./crypto-rates.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/crypto-rates", cryptoRates);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
