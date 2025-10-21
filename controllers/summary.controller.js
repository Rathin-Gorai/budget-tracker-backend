import { Op } from "sequelize";
import db from "../models/index.js";

export const getMonthlySummary = async (req, res) => {
    try {
        const userId = req.user.id; // JWT middleware sets req.user
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month);

        if (isNaN(year) || isNaN(month)) {
            return res.status(400).json({ message: "Invalid year or month" });
        }

        // Current month date range
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Fetch all transactions from 6 months ago to current month
        const sixMonthsAgo = new Date(year, month - 6, 1);
        const transactions = await db.Transaction.findAll({
            where: {
                user_id: userId,
                date: { [Op.gte]: sixMonthsAgo },
            },
            order: [["date", "ASC"]],
        });

        // Calculate current month totals
        const currentMonthTx = transactions.filter(
            (t) => new Date(t.date) >= startDate && new Date(t.date) <= endDate
        );

        const totalIncome = currentMonthTx
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalExpense = currentMonthTx
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const balance = totalIncome - totalExpense;

        // Monthly trend for last 6 months
        const monthlyTrend = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(year, month - 1 - i, 1);
            const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
            const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

            const monthTx = transactions.filter(
                (t) => new Date(t.date) >= mStart && new Date(t.date) <= mEnd
            );

            const income = monthTx
                .filter((t) => t.type === "income")
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const expense = monthTx
                .filter((t) => t.type === "expense")
                .reduce((sum, t) => sum + Number(t.amount), 0);

            monthlyTrend.push({
                month: d.toLocaleString("default", { month: "short" }),
                income,
                expense,
            });
        }

        // Fetch budget for current month
        const budget = await db.Budget.findOne({
            where: { user_id: userId, year, month },
        });

        const budgetComparison = {
            budgetAmount: budget?.amount || 0,
            spent: totalExpense,
        };

        return res.json({
            totalIncome,
            totalExpense,
            balance,
            monthlyTrend,
            budgetComparison,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
