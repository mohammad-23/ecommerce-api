/* eslint-disable no-case-declarations */
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

import Cart from "../../models/Cart";
import Order from "../../models/Order";
import { getUserId } from "../../utils/user";
import catchAsync from "../../utils/catchAsync";
import { ASCENDING } from "../../utils/constants";

export const getOrders = catchAsync(async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).send({ message: "Unauthorized: Access is denied!!" });
    }

    const orders = await Order.find({ customer: userId })
      .populate("items.product")
      .sort({ createDate: ASCENDING })
      .limit(limit)
      .skip(offset);

    const ordersCount = await Order.countDocuments({ deleted: false });

    res.status(200).json({ orders, total: ordersCount });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const createOrder = catchAsync(async (req, res) => {
  try {
    const userId = await getUserId(req);
    const { payment, status, shipping_address } = req.body;

    if (!userId) {
      res.status(401).send({ message: "Unauthorized: Access is denied!!" });
    }

    const cartData = await Cart.findOne({ customer: userId, deleted: false });

    const order = await Order.create({
      customer: userId,
      items: cartData.items,
      payment,
      total_price: cartData.total_price,
      total_items: cartData.total_items,
      status,
      shipping_address,
    });

    res.status(200).send({
      order,
      id: order._id,
      message: "Order Created SUccessfully!",
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const updateOrder = catchAsync(async (req, res) => {
  try {
    const userId = await getUserId(req);
    const { payment, status } = req.body;
    const { id } = req.params;

    if (!userId) {
      res.status(401).send({ message: "Unauthorized: Access is denied!!" });
    }

    const userOrder = await Order.findOne({
      _id: id,
      customer: userId,
      deleted: false,
    });

    if (!userOrder) {
      res.status(500).send({ message: "Order Not Found" });
    }

    if (payment) {
      userOrder.payment = payment;
    }

    if (status) {
      userOrder.status = status;
    }

    await userOrder.save();

    res.status(200).send({
      id: userOrder._id,
      message: "Order Updated SUccessfully!",
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const createCheckoutSession = catchAsync(async (req, res) => {
  try {
    const userId = getUserId(req);
    const { chosenAddress } = req.body;

    const userCart = await Cart.findOne({ customer: userId })
      .populate("items.product")
      .populate("customer");

    const line_items = userCart.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
        },
        unit_amount: item.product.price.raw * 100,
      },
      quantity: item.quantity,
    }));

    const {
      id: sessionId,
      payment_intent,
      amount_total,
      currency,
    } = await stripe.checkout.sessions.create({
      customer_email: userCart.customer.email,
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:3000/payment-status?status=success",
      cancel_url: "http://localhost:3000/payment-status?status=failure",
    });

    await Order.create({
      payment: {
        transaction_id: payment_intent,
        amount: amount_total / 100,
        status: "processing",
        currency: currency,
        transaction_createdAt: Date.now(),
      },
      customer: userId,
      total_price: amount_total / 100,
      total_items: userCart.total_items,
      items: userCart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      order_status: "placed",
      shipping_address: chosenAddress,
    });

    res.status(200).send({ id: sessionId });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const handleStripeWebhook = catchAsync(async (req, res) => {
  try {
    const payload = req.body;
    const session = payload.data.object;

    const order = await Order.findOne({
      "payment.transaction_id": session.id,
    });

    switch (payload.type) {
      case "payment_intent.succeeded":
        order.payment.status = "completed";

        await order.save();
        break;

      case "payment_intent.payment_failed":
        order.payment.status = "failed";

        await order.save();
        break;

      case "payment_intent.processing":
        order.payment.status = "processing";

        await order.save();
        break;
    }

    res.status(200);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
