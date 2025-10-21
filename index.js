
// ==========================
// Personal Budget Tracker backend
// Backend Entry Point
// ==========================

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import routers from "./routes/routes.js";
import { connectDB } from "./config/db_connect.js";
import process from "process";
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.get('/', (req, res) => {
    res.send('Personal Budget Tracker backend running..')
});
app.use("/api", routers);


// ==========================
// Start Server
// ==========================
const startServer = async () => {
    try {
        console.clear();
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Failed to start server:", err.message);
        process.exit(1);
    }
};

startServer();
