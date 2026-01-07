import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "fitting_dashboard",
  waitForConnections: true,
  connectionLimit: 10
});

app.get("/api/dashboard", async (req, res) => {
  const [rows] = await pool.query(`
    SELECT fitter AS name,
           COUNT(*) AS actual,
           SUM(job_id='DEFECT') AS defects
    FROM fittings
    GROUP BY fitter
    ORDER BY actual DESC
  `);
  res.json(rows);
});

app.listen(5001, () => console.log("API running on port 5001"));
