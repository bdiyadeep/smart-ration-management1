
const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = 5000;

const DATA_FILE = path.join(__dirname, "transactions.json");

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      new URL(origin).hostname.endsWith(".app.github.dev") ||
      origin === "http://localhost:5173"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// Read transactions from JSON file
async function readTransactions() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

// Save transactions to JSON file
async function writeTransactions(transactions) {
  await fs.writeFile(
    DATA_FILE,
    JSON.stringify(transactions, null, 2)
  );
}

// Home route
app.get("/", (req, res) => {
  res.send("Smart Ration Management System Backend is Running!");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Smart Ration Backend is Running!"
  });
});

// Synchronize offline transactions
app.post("/api/transactions/sync", async (req, res) => {
  try {
    const incoming = req.body.transactions;

    if (!Array.isArray(incoming)) {
      return res.status(400).json({
        success: false,
        message: "Transactions must be an array."
      });
    }

    const existing = await readTransactions();

    const existingMap = new Map(
      existing.map((transaction, index) => [
        transaction.id,
        index
      ])
    );

    let saved = 0;
    let updatedCount = 0;

    for (const transaction of incoming) {
      if (
        !transaction ||
        !transaction.id ||
        !(transaction.beneficiaryId || transaction.card)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid transaction data."
        });
      }

      const transactionId = transaction.id;
      const previousIndex = existingMap.get(transactionId);

      const syncedTransaction = {
        ...transaction,

        beneficiaryId:
          transaction.beneficiaryId || transaction.card,

        status: "Synced",

        serverReceivedAt:
          previousIndex !== undefined
            ? existing[previousIndex].serverReceivedAt ||
              new Date().toISOString()
            : new Date().toISOString()
      };

      if (previousIndex !== undefined) {
        existing[previousIndex] = {
          ...existing[previousIndex],
          ...syncedTransaction,
          status: "Synced"
        };

        updatedCount++;

      } else {
        existingMap.set(transactionId, existing.length);

        existing.push(syncedTransaction);

        saved++;
      }
    }

    
    await writeTransactions(existing);

    res.json({
      success: true,
      message: "Transactions synchronized successfully.",
      received: incoming.length,
      saved: saved,
      updated: updatedCount,
      syncedIds: incoming.map((item) => item.id)
    });

  } catch (error) {
    console.error("Sync error:", error);

    res.status(500).json({
      success: false,
      message: "Could not synchronize transactions."
    });
  }
});

// View all saved transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await readTransactions();

    res.json({
      success: true,
      transactions: transactions
    });

  } catch (error) {
    console.error("Read transactions error:", error);

    res.status(500).json({
      success: false,
      message: "Could not read transactions."
    });
  }
});

// Start backend server
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Smart Ration Management System running on port ${PORT}`
  );
});
