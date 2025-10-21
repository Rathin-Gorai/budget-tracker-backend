import db from "../models/index.js";

/**
 * GET /budgets/:year/:month
 * Get the budget for a specific year and month
 */
export const getBudget = async (req, res) => {
    const { year, month } = req.params;
    try {
        const budget = await db.Budget.findOne({
            where: {
                user_id: req.user.id,
                year,
                month,
            },
        });

        if (!budget) {
            return res.status(404).json({ message: "Budget not set for this month" });
        }

        res.json({ message: "Budget fetch successfully.", data: { year, month, amount: budget.amount } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch budget" });
    }
};

/**
 * POST /budgets
 * Create or set a budget
 * Body: { year, month, amount }
 */
export const createBudget = async (req, res) => {
    const { year, month, amount } = req.body;

    if (!year || !month || !amount) {
        return res.status(400).json({ message: "Year, month, and amount are required" });
    }

    try {
        // Check if a budget already exists
        const [budget, created] = await db.Budget.findOrCreate({
            where: { user_id: req.user.id, year, month },
            defaults: { amount },
        });

        if (!created) {
            return res.status(400).json({ message: "Budget already exists for this month" });
        }

        res.status(201).json({ message: "Budget created successfully.", data: { year, month, amount } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create budget" });
    }
};

/**
 * PUT /budgets/:year/:month
 * Update the budget for a specific year/month
 */
export const updateBudget = async (req, res) => {
    const { year, month } = req.params;
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
    }

    try {
        const budget = await db.Budget.findOne({
            where: { user_id: req.user.id, year, month },

        });

        if (!budget) {
            return res.status(404).json({ message: "Budget not found for this month" });
        }

        budget.amount = amount;
        budget.updated_at = new Date();

        await budget.save();

        res.json({ message: "Budget updated successfully.", data: { year, month, amount } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update budget" });
    }
};

/**
 * DELETE /budgets/:year/:month
 * Remove the budget setting for a specific year/month
 */
export const deleteBudget = async (req, res) => {
    const { year, month } = req.params;

    try {
        const budget = await db.Budget.findOne({
            where: { user_id: req.user.id, year, month },
        });

        if (!budget) {
            return res.status(404).json({ message: "Budget not found for this month" });
        }

        await budget.destroy();
        res.json({ message: "Budget deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete budget" });
    }
};
