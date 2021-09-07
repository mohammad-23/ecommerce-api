import mongoose, { Schema } from "mongoose";

const { Types } = Schema;

const CartSchema = new Schema(
  {
    total_items: {
      type: Number,
      default: 0,
    },
    total_price: {
      type: Number,
      default: 0,
    },
    items: [
      {
        product: {
          type: Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        total_price: {
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
    cart_status: {
      type: String,
      enum: ["in_progress", "abandoned"],
      default: "in_progress",
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

const Cart = mongoose.model("cart", CartSchema, "cart");

export default Cart;
