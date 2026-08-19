import express from "express";
import fetch from "node-fetch";
const router = express.Router();

const CMC_API_KEY = process.env.CMC_API_KEY; // ✅ moved to env

router.get("/", async (req, res) => {
  const symbols = "BTC,ETH,USDT,BNB,SOL,USDC,XRP,ADA,DOGE,AVAX";

  if (!CMC_API_KEY) {
    console.error("Missing CMC_API_KEY environment variable");
    return res.status(500).json({ error: "Missing CMC_API_KEY" });
  }

  try {
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}&convert=USD`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": CMC_API_KEY,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("CMC API error");

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rates" });
  }
});

export default router;
