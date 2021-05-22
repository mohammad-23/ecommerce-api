import Product from "../../models/Product";
import Category from "../../models/Category";
import catchAsync from "../../utils/catchAsync";
import toTitleCase from "../../utils/toTitleCase";
import { ASCENDING, DESCENDING } from "../../utils/constants";

export const getProducts = catchAsync(async (req, res) => {
  try {
    const {
      limit = 15,
      offset = 0,
      orderBy,
      range,
      variant,
      category: categoryToFilter,
    } = req.query;

    let filterQuery = { active: true };
    let sortObject = { createDate: ASCENDING };
    let categories = [];

    if (range) {
      const [min, max] = range.split("-");

      filterQuery = {
        ...filterQuery,
        "price.raw": {
          $gte: Number(min),
          $lte: Number(max),
        },
      };
    }

    if (variant) {
      const variantFilter = variant.split(",").map((item) => toTitleCase(item));

      filterQuery = {
        ...filterQuery,
        "variant_groups.options.name": { $in: variantFilter },
      };
    }

    if (orderBy) {
      const [sortKey, sortOrder] = orderBy.split("-");

      sortObject = { [sortKey]: sortOrder };
    }

    if (!categoryToFilter) {
      categories = await Category.find();
    } else {
      const categoryFilter = categoryToFilter
        .split(",")
        .map((item) => item.toLowerCase());

      const selectedCategories = await Category.find({
        slug: { $in: categoryFilter },
      });

      filterQuery = {
        ...filterQuery,
        categories: { $all: selectedCategories.map((item) => item._id) },
      };
    }

    const productsWithSelectedCategory = await Product.find(filterQuery)
      .populate("categories")
      .sort(sortObject)
      .limit(Number(limit))
      .skip(Number(offset));

    // To Display data for all products in the filters section
    const filterForAllProducts = { active: true };

    if (filterQuery.categories) {
      filterForAllProducts.categories = filterQuery.categories;
    }

    const totalProducts = await Product.find(filterForAllProducts)
      .populate("categories")
      .sort(sortObject);

    const productsCount = await Product.countDocuments(filterQuery);

    res.status(200).send({
      products: productsWithSelectedCategory,
      totalProducts,
      total: productsCount,
      categories,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const getHotDeals = catchAsync(async (req, res) => {
  try {
    const { orderBy, variant } = req.query;

    let filterQuery = { active: true };
    let sortObject = { createDate: ASCENDING };

    if (variant) {
      const variantFilter = variant.split(",").map((item) => toTitleCase(item));

      filterQuery = {
        ...filterQuery,
        "variant_groups.options.name": { $in: variantFilter },
      };
    }

    if (orderBy) {
      const [sortKey, sortOrder] = orderBy.split("-");

      sortObject = { [sortKey]: sortOrder };
    }

    const hotDeals = await Product.find(filterQuery).sort(sortObject).limit(10);

    res.status(200).json(hotDeals);
  } catch (error) {
    res.status(400).send({ messsage: error.message });
  }
});

export const getFavourites = catchAsync(async (req, res) => {
  try {
    const { orderBy, variant } = req.query;

    let filterQuery = { active: true };
    let sortObject = { createDate: DESCENDING };

    if (variant) {
      const variantFilter = variant.split(",").map((item) => toTitleCase(item));

      filterQuery = {
        ...filterQuery,
        "variant_groups.options.name": { $in: variantFilter },
      };
    }

    if (orderBy) {
      const [sortKey, sortOrder] = orderBy.split("-");

      sortObject = { [sortKey]: sortOrder };
    }

    const hotDeals = await Product.find(filterQuery).sort(sortObject).limit(10);

    res.status(200).json(hotDeals);
  } catch (error) {
    res.status(400).send({ messsage: error.message });
  }
});

export const getProductDetails = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, active: true })
      .populate("related_products")
      .populate("categories");

    res.status(200).json(product);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
