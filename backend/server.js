// const express = require("express");
// const cors = require("cors");
// const mysql = require("mysql2");
// const { exec } = require("child_process");
// const path = require("path");

// const app = express();
// app.use(cors());
// app.use(express.json());


// // =====================
// // MYSQL CONNECTION
// // =====================
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Sandesh@599",
//   database: "delhi_env"
// });

// db.connect(err => {
//   if (err) {
//     console.error("❌ MySQL connection failed:", err);
//     process.exit(1);
//   }
//   console.log("✅ MySQL Connected");
// });


// // =====================
// // PYTHON PATH (WINDOWS)
// // =====================
// const PYTHON_PATH = "C:\\Users\\sande\\AppData\\Local\\Programs\\Python\\Python310\\python.exe";


// // =====================
// // PYTHON FILE PATHS
// // =====================
// const PYTHON_RETRAIN = path.join(__dirname, "..", "codes", "retrain_models.py");
// const PYTHON_PREDICT = path.join(__dirname, "..", "codes", "predict.py");


// // =====================
// // INSERT DATA + RETRAIN
// // =====================
// app.post("/add-data", (req, res) => {

//   const r = req.body;

//   const sql = `
//     INSERT INTO ml_features_daily (
//       city_id, zone_id, date, pm25, pm10, no2, pollution_trend_3days,
//       humidity, wind_speed, rainfall_last_3_days, water_quality_index,
//       reservoir_level, violations_last_7_days, avg_violation_severity,
//       repeat_offender_rate, population_density, industrial_density,
//       green_cover_percentage, drainage_quality_index,
//       social_vulnerability_index, risk_score
//     )
//     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
//   `;

//   const values = [
//     r.city_id,
//     r.zone_id,
//     r.date,
//     r.pm25,
//     r.pm10,
//     r.no2,
//     r.pollution_trend_3days,
//     r.humidity,
//     r.wind_speed,
//     r.rainfall_last_3_days,
//     r.water_quality_index,
//     r.reservoir_level,
//     r.violations_last_7_days,
//     r.avg_violation_severity,
//     r.repeat_offender_rate,
//     r.population_density,
//     r.industrial_density,
//     r.green_cover_percentage,
//     r.drainage_quality_index,
//     r.social_vulnerability_index,
//     r.risk_score
//   ];

//   db.query(sql, values, (err) => {

//     if (err) {
//       console.error("❌ DB Insert Error:", err);
//       return res.status(500).json({ error: "Database insert failed" });
//     }

//     console.log("📥 Data inserted → retraining models...");

//     exec(`"${PYTHON_PATH}" "${PYTHON_RETRAIN}"`, (error, stdout, stderr) => {

//       if (error) {
//         console.error("❌ Retrain error:", stderr || error.message);
//         return res.json({
//           message: "Inserted but ML retrain failed",
//           details: stderr
//         });
//       }

//       console.log(" Retraining complete");

//       res.json({
//         message: "Data inserted and models retrained successfully",
//         retrain_logs: stdout
//       });
//     });
//   });
// });


// // =====================
// // GET LIVE PREDICTIONS
// // =====================
// app.get("/predict", (req, res) => {

//   exec(`"${PYTHON_PATH}" "${PYTHON_PREDICT}"`, (error, stdout, stderr) => {

//     if (error) {
//       console.error("❌ Prediction error:", stderr || error.message);
//       return res.status(500).json({
//         error: "Prediction failed",
//         details: stderr
//       });
//     }

//     res.json({
//       prediction_output: stdout
//     });
//   });
// });


// // =====================
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Backend running on port ${PORT}`);
// });




























const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// =====================
// CONFIG
// =====================
const FASTAPI_BASE = "http://127.0.0.1:8000";

// =====================
// MYSQL CONNECTION
// =====================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sandesh@599",
  database: "env_risk_ai"   // SAME DB as FastAPI
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    process.exit(1);
  }
  console.log("✅ MySQL Connected");
});

// =====================
// INSERT DATA
// =====================
app.post("/add-data", (req, res) => {

  const r = req.body;

  const sql = `
    INSERT INTO environmental_data (
      city_id, zone_id, date, pm25, pm10, no2,
      pollution_trend_3days, humidity, wind_speed,
      rainfall_last_3_days, water_quality_index,
      reservoir_level, violations_last_7_days,
      avg_violation_severity, repeat_offender_rate,
      population_density, industrial_density,
      green_cover_percentage, drainage_quality_index,
      social_vulnerability_index, risk_score
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  const values = [
    r.city_id,
    r.zone_id,
    r.date,
    r.pm25,
    r.pm10, 
    r.no2,
    r.pollution_trend_3days,
    r.humidity,
    r.wind_speed,
    r.rainfall_last_3_days,
    r.water_quality_index,
    r.reservoir_level,
    r.violations_last_7_days,
    r.avg_violation_severity,
    r.repeat_offender_rate,
    r.population_density,
    r.industrial_density,
    r.green_cover_percentage,
    r.drainage_quality_index,
    r.social_vulnerability_index,
    r.risk_score
  ];

  db.query(sql, values, async (err) => {

    if (err) {
      console.error("❌ DB Insert Error:", err);
      return res.status(500).json({ error: "Database insert failed" });
    }

    try {
      // Trigger retrain via FastAPI
      await axios.post(`${FASTAPI_BASE}/retrain`, {}, {
        headers: { "x-api-key": "SUPER_SECRET_KEY" }
      });

      res.json({
        message: "Data inserted & retrain triggered"
      });

    } catch (error) {
      res.json({
        message: "Data inserted but retrain failed",
        error: error.message
      });
    }
  });
});

// =====================
// FORWARD ML ROUTES
// =====================

app.get("/predict", async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_BASE}/predict`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Prediction failed" });
  }
});

app.get("/residual-anomaly", async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_BASE}/residual-anomaly`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Anomaly detection failed" });
  }
});

app.get("/risk-explain", async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_BASE}/risk-explain`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Explainability failed" });
  }
});

app.get("/retrain-status", async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_BASE}/retrain-status`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Status check failed" });
  }
});

// =====================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Node backend running on port ${PORT}`);
});