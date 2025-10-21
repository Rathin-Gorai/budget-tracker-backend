import db from "../models/index.js";


/**
 * GET /categories
 * List all categories of the logged-in user
 */
export const getCategories = async (req, res) => {
    try {
        const categories = await db.Category.findAll({
            where: { user_id: req.user.id },
            order: [["created_at", "DESC"]],
        });
        res.status(200).json({ message: "Categories fetched successfully", data: categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch categories" });
    }
};

/**
 * POST /categories
 * Create a new category for the logged-in user
 */
export const createCategory = async (req, res) => {
    const { name, type } = req.body;

    if (!name || !type) {
        return res.status(400).json({ message: "Name and type are required" });
    }

    try {
        const existingCategory = await db.Category.findOne({
            where: { name, type, user_id: req.user.id },
        });

        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        await db.Category.create({
            name,
            type,
            user_id: req.user.id,
        });
        res.status(201).json({ message: "Category created successfully." });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Failed to create category" });
    }
};

/**
 * PUT /categories/:id
 * Update a category's name by ID
 */
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    try {
        const existingCategory = await db.Category.findOne({
            where: { name, user_id: req.user.id },
        });

        if (existingCategory && existingCategory.id != id) {
            return res.status(400).json({ message: "Category already exists" });
        }
        const category = await db.Category.findOne({
            where: { id, user_id: req.user.id },
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        category.name = name;
        category.updated_at = new Date();
        await category.save();

        res.status(200).json({ message: "Category Updated successfully." });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ message: "Category name already exists" });
        }
        console.error(error);
        res.status(500).json({ message: "Failed to update category" });
    }
};

/**
 * DELETE /categories/:id
 * Delete a category by ID
 */
export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await db.Category.findOne({
            where: { id, user_id: req.user.id },
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await category.destroy();
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete category" });
    }
};
