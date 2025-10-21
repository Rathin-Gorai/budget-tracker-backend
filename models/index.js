import { sequelize } from "../config/db_connect.js";
import { Sequelize } from "sequelize";
import User from "./user.model.js";
import Category from "./category.model.js";
import Transaction from "./transactions.model.js";
import Budget from "./budget.model.js";


const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//models
db.User = User
db.Category = Category
db.Transaction = Transaction
db.Budget = Budget

Transaction.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Transaction, { foreignKey: "category_id" });


// Function to sync models with the database
async function syncModels() {
    try {
        // Sync the models with the database
        await db.sequelize.sync({ alter: true });
        console.log("Models synchronized successfully.👍");
    } catch (error) {
        console.error("Error synchronizing models:", error.message);
    }
}

// Using top-level await to properly handle the async operation
await syncModels();
export default db;