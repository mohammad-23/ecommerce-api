import Product from "../../models/Product";
import Category from "../../models/Category";
import Subcategory from "../../models/Subcategory";
import catchAsync from "../../utils/catchAsync";

export const getProducts = catchAsync(async (req, res) => {
  try {
    const {
      limit = 15,
      offset = 0,
      orderBy,
      range,
      size,
      category: categoryToFilter,
      subcategory: subcategoryToFilter,
    } = req.query;

    let filterQuery = { active: true };
    let sortObject = { createDate: "asc" };
    let categoryFilter = {
      $lookup: {
        from: "category",
        as: "categories",
        localField: "categories",
        foreignField: "_id",
      },
    };
    let subcategoryFilter = {
      $lookup: {
        from: "subcategory",
        as: "subcategories",
        localField: "subcategories",
        foreignField: "_id",
      },
    };

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

    if (size) {
      filterQuery = {
        ...filterQuery,
        "variant_groups.options.name": size,
      };
    }

    if (orderBy) {
      const [sortKey, sortOrder] = orderBy.split("-");

      sortObject = { [sortKey]: sortOrder };
    }

    let categories = [];
    let subcategories = [];

    if (!categoryToFilter) {
      categories = await Category.find();
    } else {
      // approach 1 using lookup pipeline
      categoryFilter = {
        ...categoryFilter,
        $lookup: {
          ...categoryFilter.$lookup,
          pipeline: [
            {
              $filter: {
                slug: categoryToFilter,
              },
            },
          ],
        },
      };

      delete categoryFilter.$lookup.localField;
      delete categoryFilter.$lookup.foreignField;

      // approach 2 using addFields
      // categoryFilter = {
      //   ...categoryFilter,
      //   $addFields: {
      //     categories: {
      //       $arrayElemAt: [
      //         {
      //           $filter: {
      //             input: "$categories",
      //             as: "cat",
      //             cond: {
      //               $eq: ["$$cat.slug", categoryToFilter],
      //             },
      //           },
      //         },
      //         0,
      //       ],
      //     },
      //   },
      // };
    }

    if (!subcategoryToFilter) {
      subcategories = await Subcategory.find();
    } else {
      subcategoryFilter = {
        ...subcategoryFilter,
        $lookup: {
          ...subcategoryFilter.$lookup,
          pipeline: [
            {
              $match: {
                slug: subcategoryToFilter,
              },
            },
          ],
        },
      };

      delete subcategoryFilter.$lookup.localField;
      delete subcategoryFilter.$lookup.foreignField;

      // approach 2 using addFields
      // subcategoryFilter = {
      //   ...subcategoryFilter,
      //   $addFields: {
      //     subcategories: {
      //       $arrayElemAt: [
      //         {
      //           $filter: {
      //             input: "$subcategories",
      //             as: "subcat",
      //             cond: {
      //               $eq: ["$$subcat.slug", subcategoryToFilter],
      //             },
      //           },
      //         },
      //         0,
      //       ],
      //     },
      //   },
      // };
    }

    // for approaches 1 and 2
    // const products = await Product.aggregate([
    //   { $match: filterQuery },
    //   {
    //     $lookup: {
    //       from: "category",
    //       as: "categories",
    //       localField: "categories",
    //       foreignField: "_id",
    //     },
    //   },
    //   categoryFilter,
    //   subcategoryFilter,
    // ])
    //   .sort(sortObject)
    //   .limit(Number(limit))
    //   .skip(Number(offset));

    // approach 3 using populate and match
    let categoryFilterForPopulate = {
      path: "categories",
    };

    let subcategoryFilterForPopulate = {
      path: "subcategories",
    };

    if (categoryToFilter) {
      categoryFilterForPopulate = {
        ...categoryFilterForPopulate,
        match: { slug: categoryToFilter || "" },
      };
    }

    if (subcategoryToFilter) {
      subcategoryFilterForPopulate = {
        ...subcategoryFilterForPopulate,
        match: { slug: subcategoryToFilter || "" },
      };
    }

    // To Display Products according to filters selected
    const filteredProducts = await Product.find(filterQuery)
      .populate(categoryFilterForPopulate)
      .populate(subcategoryFilterForPopulate)
      .sort(sortObject)
      .limit(Number(limit))
      .skip(Number(offset));

    // Remove all products that don't hae a category or subcategory (required fields)
    const finalResult = filteredProducts.filter(
      (product) => product.categories.length && product.subcategories.length
    );

    // To Display data for all products in the filters section
    const totalProducts = await Product.find({ active: true })
      .populate(categoryFilterForPopulate)
      .populate(subcategoryFilterForPopulate)
      .sort(sortObject);

    const productsCount = await Product.countDocuments(filterQuery);

    res.status(200).send({
      totalProducts,
      filteredProducts: finalResult,
      total: productsCount,
      categories,
      subcategories,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const getProductDetails = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;

    const product = await (
      await Product.findOne({ _id: id, active: true })
    ).populate("related_products");

    res.status(200).json(product);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
