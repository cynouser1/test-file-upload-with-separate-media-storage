import { config } from "dotenv";
config();
import express from "express";
import path from "path";
import cors from "cors";

import uploadRoute from "./routes/uploadRoute.js";
// import ensureUploadsDir from "./utils/ensureUploadsDir.js";

const app = express();
const host = process.env.HOST ?? '0.0.0.0'; // Use 
const port = process.env.MEDIA_PORT || 4002;

// Middleware
// app.use(cors()); // allow CORS for frontend
app.use(cors({ origin: "*" })); // this will allow all origins // allow CORS for frontend

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api", uploadRoute);


app.get('/', (req, res) => {
  res.send({ message: 'Hello API from media-service' });
});

app.listen(port, host, () => {
  console.log(`Media service running at ${host}:${port}`);
});
