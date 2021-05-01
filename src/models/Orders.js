import mongoose, { Schema } from "mongoose";

const { Types } = Schema;

const OrderSchema = new Schema(
  {
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    items: [
      {
        type: Types.ObjectId,
        ref: "product",
      },
    ],
    customer: {
      type: Types.ObjectId,
      required: true,
      ref: "user",
    },
    payment: {
      transaction_id: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      card: {
        type: String,
        required: true,
      },
      currency: {
        type: String,
        required: true,
      },
      transaction_createdAt: {
        type: Number,
        required: true,
      },
    },
    deleted: {
      type: Boolean,
    },
  },
  {
    timestamps: { createdAt: "createDate", updatedAt: "updateDate" },
  }
);

const Order = mongoose.model("order", OrderSchema, "order");

export default Order;
