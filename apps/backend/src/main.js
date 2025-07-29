import { config } from "dotenv";
// import dotenv from 'dotenv';
// dotenv.config();
config();
import express from 'express';
import cors from 'cors'
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./models/db.js";
import path from "path";
// const host = process.env.HOST ?? 'localhost';
const host = process.env.HOST ?? '0.0.0.0'; // Use 
const port = process.env.BACKEND_PORT ? Number(process.env.BACKEND_PORT) : 4500;
const app = express();


// Connect to MongoDB
connectDB();

// take request from frontend or from any origin
// app.use(cors({ origin: "http://localhost:4000" }));  // this will allow only localhost:4000
app.use(cors({ origin: "*" })); // this will allow all origins
// app.use(cors({ origin: process.env.FRONTEND_URL })); // this will allow only the frontend url
// app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true })); // this will allow only the frontend url and also allow cookies
// app.use(cors());

// Middleware
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/auth", authRoutes);
app.use("/api", userRoutes);

// Middleware
// app.use(express.json());

// dummy api for jokes
app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      joke: "Why did the chicken cross the road? To get to the other side!",
    },
    {
      id: 2,
      joke: "Why don't scientists trust atoms? Because they make up everything!",
    },
    {
      id: 3,
      joke: "Why did the scarecrow win an award? Because he was outstanding in his field!",
    },
    {
      id: 4,
      joke: "Why don't skeletons fight each other? They don't have the guts!",
    },
    {
      id: 5,
      joke: "What do you call fake spaghetti? An impasta!",
    },
    {
      id: 6,
      joke: "Why did the math book look sad? Because it had too many problems!",
    },
    {
      id: 7,
      joke: "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    },
    {
      id: 8,
      joke: "What do you call cheese that isn't yours? Nacho cheese!",
    },
    {
      id: 9,
      joke: "Why did the bicycle fall over? Because it was two-tired!",
    },
    {
      id: 10,
      joke: "What do you call a bear with no teeth? A gummy bear!",
    },
  ];
  res.send({ message: "Hello API from backend", data: jokes });
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello API from backend' });
});
app.listen(port, host, () => {
  // console.log(`[ ready ] http://${host}:${port}`);
  console.log(`[ ready ] in ${host}:${port}`);
});

// run on your terminal

// http://localhost:7000/
// http://127.0.0.1:7000/