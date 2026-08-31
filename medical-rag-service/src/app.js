import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import ragRoutes from "./routes/ragRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Root & Health Check Endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "MediSetu Medical OCR and RAG service is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "medisetu-medical-rag-service",
    timestamp: new Date().toISOString()
  });
});

// GPS Facility Search & Logging Endpoint
app.post("/api/facilities/search", (req, res) => {
  const { lat, lng, radiusKm, locationName } = req.body;
  console.log(`[Facility Search] Received Live GPS query for (${lat}, ${lng}), radius: ${radiusKm}km (${locationName})`);
  
  res.json({
    success: true,
    message: `Received coordinates for ${locationName || 'Live GPS'}`,
    lat,
    lng,
    radiusKm: radiusKm || 60
  });
});

// Sync offline queue mutations endpoint
app.post("/api/sync", (req, res) => {
  const { items } = req.body;
  console.log(`[Sync] Received ${items?.length || 0} offline mutations to sync`);
  
  res.json({
    success: true,
    syncedCount: items?.length || 0,
    timestamp: new Date().toISOString()
  });
});

// RAG Routes
app.use("/api/rag", ragRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});