import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const frontend_url = "https://food-del-pro-frontend.onrender.com";

// ✅ PLACE ORDER (FIXED)
const placeOrder = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { items, amount, address } = req.body;

    // 🔥 FIX: get userId from token middleware
    const userId = req.userId;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ Save order
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
    });

    await newOrder.save();

    // ✅ Clear cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // ✅ Stripe items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // ✅ Delivery charges
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 200,
      },
      quantity: 1,
    });

    // ✅ Create Stripe session
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
