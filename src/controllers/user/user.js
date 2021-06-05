import bcrypt from "bcryptjs";

import User from "../../models/User";
import Product from "../../models/Product";
import { getUserId } from "../../utils/user";
import catchAsync from "../../utils/catchAsync";
import {
  DATA_UPDATE_SUCCESS,
  UNAUTHORIZED,
  USER_NOT_FOUND,
} from "../../utils/constants";

export const getUser = catchAsync(async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).send({ message: UNAUTHORIZED });
    }

    const queryFilter = {
      _id: userId,
      deleted: false,
    };

    const user = await User.findOne({
      ...queryFilter,
    })
      .select(["-password", "-deleted"])
      .populate("wishlist");

    if (!user) {
      res.status(404).send({ message: USER_NOT_FOUND });
    }

    res.status(200).send({ user });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const checkUser = catchAsync(async (req, res) => {
  try {
    const queryFilter = {
      deleted: false,
      email: req.query.email,
    };

    const user = await User.findOne({
      ...queryFilter,
    });

    if (user) {
      res.status(200).send(true);
    } else {
      res.status(404).send({ message: USER_NOT_FOUND });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const updateUser = catchAsync(async (req, res) => {
  try {
    const { address, name, email, number, wishlist } = req.body;
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).send({ message: UNAUTHORIZED });
    }

    const queryFilter = {
      _id: userId,
      deleted: false,
    };

    const user = await User.findOne({
      ...queryFilter,
    }).populate("wishlist");

    if (!user) {
      res.status(400).send({ message: USER_NOT_FOUND });
    }

    if (email) {
      user.email = email;
    }

    if (number) {
      user.number = number;
    }

    if (name) {
      user.name = name;
    }

    if (wishlist) {
      const addedProduct = await Product.findOne({ _id: wishlist });

      const wishlistItems = user.wishlist.map((item) => item._id.toString());

      if (!wishlistItems.includes(addedProduct._id)) {
        user.wishlist.push(addedProduct);
      }
    }

    if (address) {
      if (address.is_default) {
        for (const item of user.addresses) {
          item.is_default = false;
        }
      }

      const existingAddressIndex = user.addresses.findIndex(
        (item) => item._id.toString() === address._id
      );

      if (existingAddressIndex >= 0) {
        user.addresses[existingAddressIndex] = address;
      } else {
        user.addresses.push(address);
      }
    }

    await user.save();

    // eslint-disable-next-line no-unused-vars
    const { password, deleted, ...updatedData } = user._doc;

    res.status(200).send({ message: DATA_UPDATE_SUCCESS, user: updatedData });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const changePassword = catchAsync(async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).send({ message: UNAUTHORIZED });
    }

    const user = await User.findOne({ _id: userId, deleted: false });

    if (!user) {
      res.status(400).send({ message: USER_NOT_FOUND });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      res.status(400).send({ message: "Incorrect password provided!" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).send({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export const deleteAddress = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).send({ message: UNAUTHORIZED });
    }

    const user = await User.findOne({ _id: userId, deleted: false })
      .select(["-password", "-deleted"])
      .populate("wishlist");

    if (!user) {
      res.status(400).send({ message: USER_NOT_FOUND });
    }

    const existingAddressIndex = user.addresses.findIndex(
      (item) => item._id.toString() === id
    );

    if (existingAddressIndex === -1) {
      res.status(404).send({ message: "Address not found!" });
    }

    user.addresses.splice(existingAddressIndex, 1);

    const defaultAddressIndex = user.addresses.findIndex(
      (item) => item.is_default
    );

    if (defaultAddressIndex === -1) {
      user.addresses[0].is_default = true;
    }

    await user.save();

    res.status(200).send({ user, message: DATA_UPDATE_SUCCESS });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const removeWishlistItem = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).send({ message: UNAUTHORIZED });
    }

    const queryFilter = {
      _id: userId,
      deleted: false,
    };

    const user = await User.findOne({
      ...queryFilter,
    }).populate("wishlist");

    if (!user) {
      res.status(400).send({ message: USER_NOT_FOUND });
    }

    const wishlistItemIndex = user.wishlist.findIndex(
      (item) => item._id.toString() === id
    );

    user.wishlist.splice(wishlistItemIndex, 1);

    await user.save();

    // eslint-disable-next-line no-unused-vars
    const { password, deleted, ...updatedData } = user._doc;

    res.status(200).send({ message: DATA_UPDATE_SUCCESS, user: updatedData });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
