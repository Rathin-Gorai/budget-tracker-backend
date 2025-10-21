import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "../config/db_connect.js";
import routers from "../routes/routes.js";
const app = express();
// Middlewares 
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// Routes

app.use("/api", routers);

// Default route

app.get("/", (req, res) => {
    res.send("✅ Express Server is Running...");
});

// vercel settings  start ------------------ 
let isConnected = false;
const startServer = async () => {
    try {
        if (!isConnected) {
            await connectDB();
            isConnected = true;
        }
    } catch (error) {
        console.error("❌ Error starting server:", error);
    }
};


app.use((req, res, next) => {
    if (!isConnected) {
        startServer();
    }
    next();
});

export default app;

// vercel setting end -----------------------