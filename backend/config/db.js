import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://sanketkhapake74:Swami1234@cluster0.5o9qg.mongodb.net/food-del', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB connected");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); 
    }
};
