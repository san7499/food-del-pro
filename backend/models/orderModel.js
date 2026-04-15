import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],

  amount: {
    type: Number,
    required: true,
  },

  address: {
    type: Object,
    required: true,
  },

  status: {
    type: String,
    default: "Food Processing",
  },

  payment: {
    type: Boolean,
    default: false,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
