import mongoose, { Schema } from "mongoose";

const { Types } = Schema;

const CategorySchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    number_of_products: {
      type: Number,
      required: true,
    },
    meta: {
      type: Types.Mixed,
    },
    deleted: {
      type: Boolean,
    },
  },
  {
    timestamps: { createdAt: "createDate", updatedAt: "updateDate" },
  }
);

const Category = mongoose.model("category", CategorySchema, "category");

export default Category;
