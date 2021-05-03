import User from "../../models/User";
import { getUserId } from "../../utils/user";
import catchAsync from "../../utils/catchAsync";

export const getUser = catchAsync(async (req, res) => {
  try {
    const userID = getUserId(req);

    const user = await User.findOne({
      _id: userID,
      deleted: false,
    }).select(["-password", "-deleted"]);

    res.status(200).send({ user });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
