import Cart from "../../models/Cart";
import Product from "../../models/Product";
import { getUserId } from "../../utils/user";
import catchAsync from "../../utils/catchAsync";
import {
  CART_NOT_FOUND,
  PRODUCT_NOT_FOUND,
  UNAUTHORIZED,
} from "../../utils/constants";

export const getCart = catchAsync(async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).send({ message: UNAUTHORIZED });
    }

    const userCart = await Cart.findOne({
      customer: userId,
      deleted: false,
    }).populate("items.product");

    res.status(200).send({
      cart: userCart,
      id: userCart._id,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const createCart = catchAsync(async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).send({ message: UNAUTHORIZED });
    }

    const userCart = await Cart.create({ customer: userId });

    res.status(200).send({
      cart: userCart,
      id: userCart._id,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const updateCart = catchAsync(async (req, res) => {
  try {
    const userId = getUserId(req);
    const { product } = req.body;

    if (!userId) {
      res.status(401).send({ message: UNAUTHORIZED });
    }

    const addedProduct = await Product.findOne({ _id: product.id });

    if (
      addedProduct.inventory.managed &&
      addedProduct.inventory.available < product.quantity
    ) {
      res.status(401).send({ message: "Product Quantity not available!" });
    }

    const userCart = await Cart.findOne({
      customer: userId,
      deleted: false,
    }).populate("items.product");

    if (!userCart) {
      res.status(300).send({ message: CART_NOT_FOUND });
    }

    const itemIndexInCart = userCart.items.findIndex(
      (item) => item.product.toString() === product.id
    );

    if (itemIndexInCart >= 0) {
      const itemToUpdate = userCart.items[itemIndexInCart];

      addedProduct.inventory.available +=
        itemToUpdate.quantity - product.quantity;

      if (product.quantity > 0) {
        userCart.items[itemIndexInCart] = {
          quantity: product.quantity,
          product: product.id,
          total_price: product.quantity * addedProduct.price.raw,
        };
      } else {
        userCart.items.splice(itemIndexInCart, 1);
      }
    } else {
      addedProduct.inventory.available -= product.quantity;

      userCart.items.push({
        product: product.id,
        quantity: product.quantity,
        total_price: product.quantity * addedProduct.price.raw,
      });
    }

    userCart.total_items = userCart.items.reduce(
      (accumulator, currentValue) => accumulator + currentValue.quantity,
      0
    );

    userCart.total_price = userCart.items.reduce(
      (accumulator, currentValue) => accumulator + currentValue.total_price,
      0
    );

    await userCart.save();
    await addedProduct.save();

    res.status(200).send({
      cart: userCart,
      id: userCart._id,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const clearCart = catchAsync(async (req, res) => {
  try {
    const userId = getUserId(req);
    const { cartId } = req.body;

    if (!userId) {
      res.status(401).send({ message: UNAUTHORIZED });
    }

    const userCart = await Cart.findOne({
      _id: cartId,
      customer: userId,
      deleted: false,
    });

    if (!userCart) {
      res.status(300).send({ message: CART_NOT_FOUND });
    }

    await userCart.items.map(async (item) => {
      const productId = item.product.toString();

      const addedProduct = await Product.findOne({ _id: productId });

      addedProduct.inventory.available += item.quantity;

      await addedProduct.save();
    });

    userCart.total_items = 0;
    userCart.items = [];
    userCart.total_price = 0;

    await userCart.save();

    res.status(200).send({
      cart: userCart,
      id: userCart._id,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const deleteCartItem = catchAsync(async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId) {
      res.status(401).send({ message: UNAUTHORIZED });
    }

    const userCart = await Cart.findOne({
      customer: userId,
      deleted: false,
    }).populate("items.product");

    if (!userCart) {
      res.status(400).send({ message: CART_NOT_FOUND });
    }

    const cartItemIndex = userCart.items.findIndex(
      (item) => item.product.toString() === id
    );

    if (cartItemIndex === -1) {
      res.status(400).send({ message: PRODUCT_NOT_FOUND });
    }

    userCart.items.splice(cartItemIndex, 1);

    await userCart.save();

    res.status(200).send({
      cart: userCart,
      id: userCart._id,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
