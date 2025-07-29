import { config } from "dotenv";
config();
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";

import { fileURLToPath } from "url";

import uploadRoute from "./routes/uploadRoute.js";
// import ensureUploadsDir from "./utils/ensureUploadsDir.js";

const app = express();
const host = process.env.HOST ?? '0.0.0.0'; // Use 
const port = process.env.MEDIA_PORT || 4002;

// Static path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
// const uploadDir = path.join(__dirname, "uploads");


// Middleware
// app.use(cors()); // allow CORS for frontend
app.use(cors({ origin: "*" })); // this will allow all origins // allow CORS for frontend
// app.use("/uploads", express.static("uploads")); // serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Routes
// app.use("/api/media/upload", uploadRoute);
app.use("/api", uploadRoute);


app.get('/', (req, res) => {
  res.send({ message: 'Hello API from media-service' });
});

app.listen(port, host, () => {
  console.log(`Media service running at ${host}:${port}`);
});
