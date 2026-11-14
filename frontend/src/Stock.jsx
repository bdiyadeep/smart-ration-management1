
import { useEffect, useState } from "react";

export default function Stock() {
  const [riceStock, setRiceStock] = useState(() => {
    return Number(localStorage.getItem("riceStock")) || 500;
  });

  const [wheatStock, setWheatStock] = useState(() => {
    return Number(localStorage.getItem("wheatStock")) || 300;
  });

  const [riceInput, setRiceInput] = useState("");
  const [wheatInput, setWheatInput] = useState("");
  const [message, setMessage] = useState("");

  const [stockHistory, setStockHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("stockHistory")) || [];
    } catch {
      return [];
    }
  });

  // Save available stock
  useEffect(() => {
    localStorage.setItem("riceStock", riceStock);
    localStorage.setItem("wheatStock", wheatStock);
  }, [riceStock, wheatStock]);

  // Save stock history
  useEffect(() => {
    localStorage.setItem(
      "stockHistory",
      JSON.stringify(stockHistory)
    );
  }, [stockHistory]);

  // Add new stock
  const addStock = () => {
    const rice = Number(riceInput);
    const wheat = Number(wheatInput);

    if (
      riceInput === "" ||
      wheatInput === "" ||
      rice < 0 ||
      wheat < 0 ||
      !Number.isFinite(rice) ||
      !Number.isFinite(wheat) ||
      (!rice && !wheat)
    ) {
      setMessage("Please enter valid stock quantities.");
      return;
    }

    setRiceStock((previous) => previous + rice);
    setWheatStock((previous) => previous + wheat);

    // Record stock addition
    setStockHistory((previous) => [
      {
        id: Date.now(),
        date: new Date().toLocaleString(),
        activity: "Stock Added",
        rice,
        wheat,
      },
      ...previous,
    ]);

    setRiceInput("");
    setWheatInput("");
    setMessage("Stock added successfully!");
  };

  return (
    <div style={styles.container}>
      <h2>Stock Management</h2>

      <p style={styles.subtitle}>
        Monitor and manage your shop ration stock.
      </p>

      {/* Available Stock */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Rice Stock</h3>
          <h1>{riceStock} kg</h1>
          <p>Available rice</p>

          {riceStock < 50 && (
            <strong style={styles.warning}>
              Low rice stock!
            </strong>
          )}
        </div>

        <div style={styles.card}>
          <h3>Wheat Stock</h3>
          <h1>{wheatStock} kg</h1>
          <p>Available wheat</p>

          {wheatStock < 50 && (
            <strong style={styles.warning}>
              Low wheat stock!
            </strong>
          )}
        </div>
      </div>

      {/* Add New Stock */}
      <div style={styles.form}>
        <h3>Add New Stock</h3>

        <label>Rice quantity (kg)</label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={riceInput}
          onChange={(e) => setRiceInput(e.target.value)}
          placeholder="Enter rice quantity"
        />

        <label>Wheat quantity (kg)</label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={wheatInput}
          onChange={(e) => setWheatInput(e.target.value)}
          placeholder="Enter wheat quantity"
        />

        <button onClick={addStock}>
          Add Stock
        </button>

        {message && <p>{message}</p>}
      </div>

      {/* Stock History */}
      <div style={styles.history}>
        <h3>Stock History</h3>

        {stockHistory.length === 0 ? (
          <p>No stock history available.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Activity</th>
                  <th style={styles.th}>Rice (kg)</th>
                  <th style={styles.th}>Wheat (kg)</th>
                </tr>
              </thead>

              <tbody>
                {stockHistory.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>{item.date}</td>
                    <td style={styles.td}>{item.activity}</td>
<td style={styles.td}>
  {item.rice > 0 ? `+${item.rice}` : item.rice}
</td>
<td style={styles.td}>
  {item.wheat > 0 ? `+${item.wheat}` : item.wheat}
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "25px",
    color: "#263238",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: "25px",
  },

  cards: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    minWidth: "220px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  warning: {
    color: "#d32f2f",
    display: "block",
    marginTop: "10px",
  },

  form: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    marginTop: "25px",
    maxWidth: "450px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  history: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    marginTop: "25px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },
};
