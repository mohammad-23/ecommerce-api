import mongoose, { Schema } from "mongoose";

const { Types } = Schema;

const SubcategorySchema = new Schema({
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
});

const Subcategory = mongoose.model(
  "subcategory",
  SubcategorySchema,
  "subcategory"
);

export default Subcategory;
