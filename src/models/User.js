import mongoose, { Schema } from "mongoose";

import { hashPassword } from "../utils/user";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      validate: {
        validator: async (email) =>
          (await User.where({ email }).countDocuments()) === 0,
        message: () => "User with this Email Already exists!",
      },
    },
    password: {
      type: String,
      minlength: 8,
    },
    first_name: {
      type: String,
      minlength: 3,
    },
    last_name: {
      type: String,
      minlength: 3,
    },
    avatar: {
      type: String,
    },
    shipping_address: [
      {
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
      },
    ],
    cards: [
      {
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
      },
    ],
    deleted: {
      type: Boolean,
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
  const { _id, ...object } = this.toObject();
  object.id = _id;

  return object;
});

const User = mongoose.model("user", UserSchema, "user");

export default User;
