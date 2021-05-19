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
      validate: {
        validator: async (name) =>
          (await Category.where({ name }).countDocuments()) === 0,
        message: () => "Category with this Name already exists!",
      },
    },
    description: {
      type: String,
      required: true,
    },
    category_type: {
      type: String,
      enum: ["primary_cat", "secondary_cat"],
      default: "secondary_cat",
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
