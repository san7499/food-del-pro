import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const frontend_url = "https://food-del-pro-frontend.onrender.com";


const placeOrder = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { items, amount, address } = req.body;
    const userId = req.userId;


    if (!userId || !items || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }


    if (amount < 50) {
      return res.status(400).json({
        success: false,
        message: "Minimum order amount should be ₹50",
      });
    }


    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
    });

    await newOrder.save();


    await userModel.findByIdAndUpdate(userId, { cartData: {} });


    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));


    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 200,
      },
      quantity: 1,
    });


    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(200).json({
      success: true,
      session_url: session.url,
    });

  } catch (error) {
    console.error("Order Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    if (!orderId || success === undefined) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed" });
    }

  } catch (error) {
    console.error("Verify Error:", error);

    res.status(500).json({
      success: false,
      message: "Error verifying order",
    });
  }
};


const userOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await orderModel.find({ userId });

    res.json({
      success: true,
      data: orders,
    });

  } catch (error) {
    console.error("User Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};


const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    res.json({
      success: true,
      data: orders,
    });

  } catch (error) {
    console.error("List Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching all orders",
    });
  }
};


const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing data",
      });
    }

    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({
      success: true,
      message: "Order status updated",
    });

  } catch (error) {
    console.error("Update Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Error updating status",
    });
  }
};


export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
};
