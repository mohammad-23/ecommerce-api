import mongoose, { Schema } from "mongoose";

const { Types } = Schema;

const FilterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  filterOptions: [
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

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
  filters: [FilterSchema],
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
