import User from "../../models/User";
import catchAsync from "../../utils/catchAsync";

export const getUser = catchAsync(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
      deleted: false,
    }).select(["-password", "-deleted"]);

    res.status(200).send({ user });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
