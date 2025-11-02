// src/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import eventRoutes from "./routes/eventRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// health
app.get("/", (req, res) => res.send("Server is running successfully 🚀"));

// mount events API
app.use("/api/events", eventRoutes);

// error fallback
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
