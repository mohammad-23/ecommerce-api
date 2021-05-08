import bcrypt from "bcryptjs";

import User from "../../models/User";
import catchAsync from "../../utils/catchAsync";
import { generateAuthToken } from "../../utils/user";

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ email, deleted: false }).select(
      "-deleted"
    );

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Incorrect Password!" });
    }

    // eslint-disable-next-line no-unused-vars
    const { password: _, ...dbUser } = user.toJSON();

    const authToken = generateAuthToken(dbUser);

    res.status(200).send({ user: dbUser, token: `Bearer ${authToken}` });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const register = catchAsync(async (req, res) => {
  const { email, password, name, number } = req.body;

  if (!(email && password)) {
    res.status(400).send({ message: "Missing required fields" });
  }

  try {
    const user = await User.create({ email, password, name, number });

    // eslint-disable-next-line no-unused-vars
    const { password: _, ...dbUser } = user.toJSON();

    const authToken = generateAuthToken(dbUser);

    res.status(200).send({
      id: dbUser.id,
      token: authToken,
      user,
      message: "User Created Successfully",
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
