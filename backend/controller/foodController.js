import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add food item
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded!" });
        }

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.file.filename
        });

        await food.save();
        res.status(201).json({ success: true, message: "Food added successfully", data: food });
    } catch (error) {
        console.error("Error adding food:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all food items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.status(200).json({ success: true, data: foods });
    } catch (error) {
        console.error("Error fetching food list:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found!" });
        }

        // Delete image file if it exists
        if (food.image) {
            fs.unlink(`uploads/${food.image}`, (err) => {
                if (err) console.error("Error deleting image:", err);
            });
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.error("Error removing food:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { addFood, listFood, removeFood };
