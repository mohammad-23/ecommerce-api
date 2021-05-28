import bcrypt from "bcryptjs";

import User from "../../models/User";
import { getUserId } from "../../utils/user";
import catchAsync from "../../utils/catchAsync";

export const getUser = catchAsync(async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).send({ message: "Unauthorized: Access is denied!" });
    }

    const queryFilter = {
      _id: userId,
      deleted: false,
    };

    const user = await User.findOne({
      ...queryFilter,
    }).select(["-password", "-deleted"]);

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
    }).select(["-password", "-deleted"]);

    if (user) {
      res.status(200).send(true);
    } else {
      res.status(404).send({ message: "User does not exist!" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const updateUser = catchAsync(async (req, res) => {
  try {
    const { address, name, email, number } = req.body;
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).send({ message: "Unauthorized: Access is denied!" });
    }

    const queryFilter = {
      _id: userId,
      deleted: false,
    };

    const user = await User.findOne({
      ...queryFilter,
    });

    if (!user) {
      res.status(400).send({ message: "User not found!" });
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

    res
      .status(200)
      .send({ message: "Data updated successfully!", user: updatedData });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const changePassword = catchAsync(async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).send({ message: "Unauthorized: Access is denied! " });
    }

    const user = await User.findOne({ _id: userId, deleted: false });

    if (!user) {
      res.status(400).send({ message: "User doesn't exist!" });
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
      res.status(401).send({ message: "Unauthorized: Access is denied!" });
    }

    const user = await User.findOne({ _id: userId, deleted: false }).select([
      "-password",
      "-deleted",
    ]);

    if (!user) {
      res.status(400).send({ message: "User not found!" });
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

    res.status(200).send({ user, message: "Address deleted Successfully!" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
