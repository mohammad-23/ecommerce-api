import mongoose, { Schema } from "mongoose";

const { Types } = Schema;

const CartSchema = new Schema(
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
    deleted: {
      type: Boolean,
    },
  },
  {
    timestamps: { createdAt: "createDate", updatedAt: "updateDate" },
  }
);

const Cart = mongoose.model("cart", CartSchema, "cart");

export default Cart;
