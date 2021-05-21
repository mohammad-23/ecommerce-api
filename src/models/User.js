import mongoose, { Schema } from "mongoose";

import { hashPassword } from "../utils/user";

const AddressSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  pin_code: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});

const CardSchema = new Schema({
  ends_with: {
    type: Number,
  },
  brand: {
    type: String,
  },
  expiry_date: {
    month: {
      type: Number,
    },
    year: {
      type: Number,
    },
  },
  name_on_card: {
    type: String,
  },
});

const UserSchema = new Schema(
  {
    email: {
      type: String,
      validate: {
        validator: async (email) =>
          (await User.where({ email }).countDocuments()) === 0,
        message: () => "User with this Email Already exists!",
      },
      required: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: true,
    },
    name: {
      type: String,
      minlength: 3,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
    },
    addresses: [AddressSchema],
    cards: [CardSchema],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "createDate", updatedAt: "updateDate" },
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);

    next();
  } else {
    next();
  }
});

UserSchema.method("toJSON", function () {
  const userObject = this.toObject();

  userObject.id = userObject._id;
  delete userObject._id;

  return userObject;
});

const User = mongoose.model("user", UserSchema, "user");

export default User;
