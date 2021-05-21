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
      res.status(401).send({ message: "Invalid Authentication!" });
    }

    const orders = await Order.find({ customer: userId })
      .populate("items")
      .sort({ createDate: ASCENDING })
      .limit(limit)
      .skip(offset);

    res.status(200).json(orders);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const createOrder = catchAsync(async (req, res) => {
  try {
    const userId = await getUserId(req);
    const { payment, status } = req.body;

    if (!userId) {
      res.status(401).send({ message: "Invalid Authentication!" });
    }

    const cartData = await Cart.findOne({ customer: userId, deleted: false });

    const order = await Order.create({
      customer: userId,
      items: cartData.items,
      payment,
      total_price: cartData.total_price,
      total_items: cartData.total_items,
      status,
    });

    res.status(200).send({
      data: order,
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
    const { payment, status, orderId } = req.body;

    if (!userId) {
      res.status(401).send({ message: "Invalid Authentication!" });
    }

    const userOrder = await Order.findOne({ _id: orderId, deleted: false });

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
