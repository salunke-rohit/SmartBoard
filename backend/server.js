import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import ocrRoutes from "./routes/ocrRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


/* =========================================
   MIDDLEWARE
========================================= */

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  })
);


/* =========================================
   TEST ROUTE
========================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SmartBoard backend is running",
  });
});


/* =========================================
   HEALTH CHECK
========================================= */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy",
  });
});


/* =========================================
   OCR ROUTES
========================================= */

app.use("/api/ocr", ocrRoutes);


/* =========================================
   404 HANDLER
========================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


/* =========================================
   ERROR HANDLER
========================================= */

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});


/* =========================================
   START SERVER
========================================= */

const server = app.listen(PORT, () => {
  console.log("");
  console.log("=================================");
  console.log("     SMARTBOARD BACKEND");
  console.log("=================================");
  console.log(
    `Server: http://localhost:${PORT}`
  );
  console.log(
    `Health: http://localhost:${PORT}/api/health`
  );
  console.log("=================================");
  console.log("");
});


/* =========================================
   SERVER ERROR
========================================= */

server.on("error", (error) => {
  console.error(
    "Server failed to start:"
  );

  console.error(error);
});