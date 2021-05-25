import User from "../../models/User";
import { getUserId } from "../../utils/user";
import catchAsync from "../../utils/catchAsync";

export const getUser = catchAsync(async (req, res) => {
  try {
    const userID = getUserId(req);

    const queryFilter = {
      _id: userID,
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
    const { address } = req.body;
    const userID = getUserId(req);

    const queryFilter = {
      _id: userID,
      deleted: false,
    };

    const user = await User.findOne({
      ...queryFilter,
    });

    if (!user) {
      res.status(400).send({ message: "User not found!" });
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
      .send({ message: "Address added successfully!", user: updatedData });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
