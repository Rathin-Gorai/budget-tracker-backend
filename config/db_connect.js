import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import process from "process";
import pg from "pg";
dotenv.config();
// Initialize Sequelize instance
const useSSL = process.env.DB_SSL === "true";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        dialectModule: pg,
        logging: false,
        dialectOptions: useSSL
            ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            }
            : {},
    }
);


// Test the connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // stop server if DB not connected
    }
};

export { sequelize, connectDB };