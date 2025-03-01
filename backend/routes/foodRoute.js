import express from 'express';
import { addFood, listFood, removeFood } from '../controller/foodController.js';
import multer from 'multer';
import path from 'path';

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure the 'uploads' directory exists
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, and JPG files are allowed!'), false);
        }
    }
});

// Route for adding food with image upload
foodRouter.post("/add", upload.single("image"), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded!" });
        }
        await addFood(req, res);
    } catch (error) {
        next(error);
    }
});

// Route for listing food items
foodRouter.get("/list", async (req, res, next) => {
    try {
        await listFood(req, res);
    } catch (error) {
        next(error);
    }
});

// Route for removing a food item
foodRouter.post("/remove", async (req, res, next) => {
    try {
        await removeFood(req, res);
    } catch (error) {
        next(error);
    }
});

export default foodRouter;
