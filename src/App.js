// src/App.js
import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadSheet() {
      try {
        const sheetId = "1sx_DOJLbAuWby0D46r20L39zr8rxeeMkHNaFSCj1MIk";
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

        const res = await fetch(url);
        const text = await res.text();

        const jsonText = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
        const json = JSON.parse(jsonText);

        const rows = (json.table.rows || [])
          .map(row => ({
            name: row.c[0]?.v || "",
            target: row.c[1]?.v || "",
            a10: row.c[2]?.v || "",
            a1: row.c[3]?.v || "",
            a3: row.c[4]?.v || "",
            a430: row.c[5]?.v || "",
            defects: row.c[6]?.v ?? 0,
          }))
          .filter(row =>
            row.name &&
            !String(row.name).includes("0.") &&
            row.name !== "0"
          );

        // Separate totals row
        const normalRows = rows.filter(r => !r.name.toLowerCase().includes("total"));
        const totalsRow = rows.find(r => r.name.toLowerCase().includes("total"));

        // Sort non-total rows by total actual output descending
        const sortedRows = [...normalRows.sort((a, b) => {
          const totalA = Number(a.a10 || 0) + Number(a.a1 || 0) + Number(a.a3 || 0) + Number(a.a430 || 0);
          const totalB = Number(b.a10 || 0) + Number(b.a1 || 0) + Number(b.a3 || 0) + Number(b.a430 || 0);
          return totalB - totalA;
        })];

        if (totalsRow) sortedRows.push(totalsRow); // append totals at the bottom

        setData(sortedRows);
      } catch (err) {
        console.error("Failed to load sheet:", err);
        setData([]);
      }
    }

    loadSheet();
    const timer = setInterval(loadSheet, 5000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date().toLocaleDateString("en-GB");

  const line = "1px solid #f4c17a";
  const headerBg = "#ffe8c5";
  const totalsBg = "#fff6e6";

  return (
    <div style={{
      background: "white",
      padding: "30px 40px",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif"
    }}>
      {/* Title */}
      <h1 style={{
        textAlign: "center",
        fontSize: "48px",
        marginBottom: "10px",
        fontWeight: 800
      }}>
        Fitting Dashboard
      </h1>

      {/* Date */}
      <div style={{
        fontSize: "36px",
        fontWeight: 700,
        marginBottom: "20px"
      }}>
        {today}
      </div>

      {/* HEADER */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 4fr 1fr",
        background: headerBg,
        borderTop: line,
        fontSize: "32px",
        fontWeight: 700,
        textAlign: "center",
        borderBottom: line
      }}>
        <div style={{ padding: "12px", borderRight: line }}>Name</div>
        <div style={{ padding: "12px", borderRight: line }}>Target</div>
        <div style={{ padding: "12px", borderRight: line }}>Actual Output</div>
        <div style={{ padding: "12px" }}>Defects</div>
      </div>

      {/* TIME ROW */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 4fr 1fr",
        fontSize: "30px",
        fontWeight: 600,
        textAlign: "center",
        borderBottom: line
      }}>
        <div></div>
        <div></div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          borderRight: line
        }}>
          <div style={{ padding: "10px", borderRight: line }}>10:00 AM</div>
          <div style={{ padding: "10px", borderRight: line }}>1:00 PM</div>
          <div style={{ padding: "10px", borderRight: line }}>3:00 PM</div>
          <div style={{ padding: "10px" }}>4:30 PM</div>
        </div>
        <div></div>
      </div>

      {/* DATA ROWS */}
      {data.map((item, i) => {
        const isTotals = item.name.toLowerCase().includes("total");

        // Daily Totals coloring: green if each actual ≥ target, else red
        const totalActual = [item.a10, item.a1, item.a3, item.a430].reduce((a, b) => a + Number(b || 0), 0);
        const totalTarget = Number(item.target || 0);
        const actualColor = isTotals ? (totalActual >= totalTarget ? "green" : "red") : null;

        return (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 4fr 1fr",
            borderBottom: line,
            background: isTotals ? totalsBg : "transparent",
            fontSize: isTotals ? "34px" : "30px",
            textAlign: "center",
            fontWeight: isTotals ? 900 : 500
          }}>
            <div style={{ padding: "12px", borderRight: line, textAlign: "left" }}>{item.name}</div>
            <div style={{ padding: "12px", borderRight: line }}>{item.target}</div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              borderRight: line
            }}>
              {[item.a10, item.a1, item.a3, item.a430].map((val, idx) => (
                <div key={idx} style={{
                  padding: "12px",
                  borderRight: idx < 3 ? line : "none",
                  color: isTotals ? actualColor : Number(val || 0) < 50 ? "red" : "green"
                }}>
                  {val}
                </div>
              ))}
            </div>

            <div style={{
              padding: "12px",
              color: "red"
            }}>
              {item.defects}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
