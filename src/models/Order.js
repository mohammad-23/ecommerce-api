import mongoose, { Schema } from "mongoose";

const { Types } = Schema;

const OrderSchema = new Schema(
  {
    total_items: {
      type: Number,
      required: true,
      default: 0,
    },
    total_price: {
      type: Number,
      default: 0,
    },
    shipping_address: {
      address: {
        type: String,
        required: true,
      },
      pin_code: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
    items: [
      {
        product: {
          type: Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          required: true,
        },
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
    status: {
      type: String,
      enum: ["success", "failed"],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "createDate", updatedAt: "updateDate" },
  }
);

const Order = mongoose.model("order", OrderSchema, "order");

export default Order;
