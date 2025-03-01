import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"; 
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const frontend_url = "http://localhost:5173";

// Place Order
const placeOrder = async (req, res) => {
    try {
        console.log("Request body:", req.body);

        // Validate input data
        const { userId, items, amount, address } = req.body;
        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        // Save order in the database
        const newOrder = new orderModel({ userId, items, amount, address });
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Prepare line items for Stripe
        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: { name: item.name },
                unit_amount: item.price * 100, // Convert to the smallest currency unit
            },
            quantity: item.quantity,
        }));

        // Add delivery charges
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: { name: "Delivery Charges" },
                unit_amount: 200, // 2 INR
            },
            quantity: 1,
        });

        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        console.log("Stripe session created:", session.id);
        res.status(200).json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Error placing order." });
    }
};

// Verify Order
const verifyOrder = async (req, res) => {
    try {
        console.log("Verifying order:", req.body);

        const { orderId, success } = req.body;
        if (!orderId || success === undefined) {
            return res.status(400).json({ success: false, message: "Invalid request data." });
        }

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.status(200).json({ success: true, message: "Payment successful" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.status(200).json({ success: false, message: "Payment failed, order deleted" });
        }

    } catch (error) {
        console.error("Error verifying order:", error);
        res.status(500).json({ success: false, message: "Error verifying order." });
    }
};

// Fetch User Orders
const userOrders = async (req, res) => {
    try {
        if (!req.body.userId) {
            return res.status(400).json({ success: false, message: "User ID is required." });
        }

        const orders = await orderModel.find({ userId: req.body.userId });
        res.status(200).json({ success: true, data: orders });

    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: "Error fetching orders." });
    }
};

// Fetch All Orders (Admin Panel)
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json({ success: true, data: orders });

    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Error fetching orders." });
    }
};

// Update Order Status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "Order ID and status are required." });
        }

        await orderModel.findByIdAndUpdate(orderId, { status });
        res.status(200).json({ success: true, message: "Order status updated." });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Error updating status." });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
