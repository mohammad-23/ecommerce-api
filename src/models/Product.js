import mongoose, { Schema } from "mongoose";

const { Types } = Schema;

const AssetsSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    is_image: {
      type: Boolean,
      default: true,
    },
    filename: {
      type: String,
      required: true,
    },
    file_size: {
      type: Number,
      required: true,
    },
    file_extension: {
      type: String,
      required: true,
    },
    image_dimensions: {
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
    },
    meta: {},
  },
  { _id: false }
);

const PriceSchema = new Schema(
  {
    raw: {
      type: Number,
      required: true,
    },
    formatted: {
      type: String,
      required: true,
    },
    formatted_with_symbol: {
      type: String,
      required: true,
    },
    formatted_with_code: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const RelatedProductsSchema = new Schema({
  permalink: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  short_description: {
    type: String,
    required: true,
  },
  long_description: {
    type: String,
    required: true,
  },
  price: PriceSchema,
  media: {
    image_type: {
      type: String,
    },
    source: {
      type: String,
    },
  },
});

const OptionsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: PriceSchema,
  assets: [AssetsSchema],
});

const VariantGroupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  options: [OptionsSchema],
});

const ProductSchema = new Schema({
  permalink: {
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
  price: PriceSchema,
  inventory: {
    managed: {
      type: Boolean,
      default: false,
    },
    available: {
      type: Number,
      default: 0,
    },
  },
  media: {
    image_type: {
      type: String,
    },
    source: {
      type: String,
    },
  },
  sort_order: {
    type: Number,
    default: 0,
  },
  variant_groups: [VariantGroupSchema],
  categories: {
    type: Types.ObjectId,
    ref: "category",
  },
  subcategories: [
    {
      type: Types.ObjectId,
      ref: "subcategory",
    },
  ],
  assets: [AssetsSchema],
  related_products: [RelatedProductsSchema],
  active: {
    type: Boolean,
    default: true,
  },
});

const Product = mongoose.model("product", ProductSchema, "product");

export default Product;
