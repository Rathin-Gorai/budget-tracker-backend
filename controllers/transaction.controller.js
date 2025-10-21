
import { Op } from "sequelize";
import db from "../models/index.js";

/**
 * GET /transactions
 * List the authenticated user's transactions with filters & pagination
 * Query params: category, startDate, endDate, minAmount, maxAmount, page, limit
 */
export const getTransactions = async (req, res) => {
    try {
        const userId = req.user.id;

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        // Filters
        const filters = { user_id: userId };

        if (req.query.category) {
            // Get category by name for the current user
            const category = await db.Category.findOne({
                where: { user_id: userId, name: req.query.category },
            });
            if (category) {
                filters.category_id = category.id;
            } else {
                // No matching category -> return empty result
                return res.json({ transactions: [], total: 0, page, limit });
            }
        }

        if (req.query.startDate || req.query.endDate) {
            filters.date = {};
            if (req.query.startDate) filters.date[Op.gte] = req.query.startDate;
            if (req.query.endDate) filters.date[Op.lte] = req.query.endDate;
        }

        if (req.query.minAmount || req.query.maxAmount) {
            filters.amount = {};
            if (req.query.minAmount) filters.amount[Op.gte] = req.query.minAmount;
            if (req.query.maxAmount) filters.amount[Op.lte] = req.query.maxAmount;
        }

        if (req.query.type) {
            filters.type = req.query.type;
        }


        const { rows: transactions, count: total } = await db.Transaction.findAndCountAll({
            where: filters,
            include: [{
                model: db.Category,
                attributes: ['name']
            }],
            order: [["date", "DESC"]],
            limit,
            offset,
        });

        res.json({ message: "Transection fetch successfully.", data: { transactions, total, page, limit } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
};

/**
 * GET /transactions/:id
 * Get details of one transaction by ID
 */
export const getTransactionById = async (req, res) => {
    console.log(req.user.id);

    try {
        const transaction = await db.Transaction.findOne({
            where: { id: req.params.id },
        });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.json({ message: "Transection fetch successfully.", data: transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch transaction" });
    }
};

/**
 * POST /transactions
 * Create a new transaction
 */
export const createTransaction = async (req, res) => {
    const { type, amount, date, category_id, description } = req.body;
    if (!type || !amount || !date || !category_id) {
        return res.status(400).json({ message: "Type, amount, date, and category_id are required" });
    }

    try {
        const transaction = await db.Transaction.create({
            type,
            amount,
            date,
            category_id,
            description,
            user_id: req.user.id,
            created_at: new Date(),
            updated_at: new Date(),
        });

        res.status(201).json({ message: "Transection created Successfully", data: transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create transaction" });
    }
};

/**
 * PUT /transactions/:id
 * Update an existing transaction by ID
 */
export const updateTransaction = async (req, res) => {
    const { type, amount, date, categoryId, description } = req.body;

    try {
        const transaction = await db.Transaction.findOne({
            where: { id: req.params.id, user_id: req.user.id },
        });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        if (type) transaction.type = type;
        if (amount) transaction.amount = amount;
        if (date) transaction.date = date;
        if (categoryId) transaction.category_id = categoryId;
        if (description !== undefined) transaction.description = description;

        transaction.updated_at = new Date();

        await transaction.save();
        res.json({ message: "Transection updated successfully.", data: transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update transaction" });
    }
};

/**
 * DELETE /transactions/:id
 * Delete a transaction by ID
 */
export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await db.Transaction.findOne({
            where: { id: req.params.id, user_id: req.user.id },
        });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        await transaction.destroy();
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete transaction" });
    }
};
