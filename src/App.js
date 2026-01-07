// src/App.js
import React, { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadSheet() {
      try {
        const sheetId = "1sx_DOJLbAuWby0D46r20L39zr8rxeeMkHNaFSCj1MIk";
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

        const res = await fetch(url);
        const text = await res.text();

        const jsonText = text.substring(
          text.indexOf("{"),
          text.lastIndexOf("}") + 1
        );
        const json = JSON.parse(jsonText);

        const rows = (json.table.rows || [])
          .map((row) => ({
            name: row.c[0]?.v?.toString().trim() || "",
            target: Number(row.c[1]?.v || 0),
            actual: Number(row.c[2]?.v || 0),
            defects: Number(row.c[3]?.v || 0),
          }))
          .filter((row) => row.name !== "");
        const normalRows = rows.filter(
          (r) => !r.name.toLowerCase().includes("total")
        );
        const totalsRow = rows.find((r) =>
          r.name.toLowerCase().includes("total")
        );

        const sortedRows = [
          ...normalRows.sort((a, b) => {
            const totalA =
              Number(a.a10 || 0) +
              Number(a.a1 || 0) +
              Number(a.a3 || 0) +
              Number(a.a430 || 0);
            const totalB =
              Number(b.a10 || 0) +
              Number(b.a1 || 0) +
              Number(b.a3 || 0) +
              Number(b.a430 || 0);
            return totalB - totalA;
          }),
        ];

        if (totalsRow) sortedRows.push(totalsRow);

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

  return (
    <div className="dashboard-container">
      <h1 className="title">Fitting Dashboard</h1>
      <div className="today">{today}</div>

      {/* HEADER */}
      <div className="header-row">
        <div>Name</div>
        <div>Target</div>
        <div>Actual</div>
        <div>Defects</div>
      </div>

      {/* DATA ROWS */}
      {data.map((item, i) => (
        <div
          key={i}
          className={`data-row ${
            item.name.toLowerCase().includes("total") ? "total-row" : ""
          }`}
        >
          <div>{item.name}</div>
          <div>{item.target}</div>
          <div>{item.actual}</div>
          <div>{item.defects}</div>
        </div>
      ))}
    </div>
  );
}

export default App;
