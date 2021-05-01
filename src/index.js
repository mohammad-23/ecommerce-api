import express from "express";
import dotenv from "dotenv";
import Commerce from "@chec/commerce.js";

const commerce = new Commerce(
  "pk_26067f758a4b63b1c1e280d7f61e1da69ea0b9dc15aea",
  true
);

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.get("/", async (req, res) => {
  const { data: categories } = await commerce.categories.list();

  const primaryCategories = ["men", "women", "kids"];

  const dataForDB = categories.map((item) => {
    const { products, ...category } = item;

    if (primaryCategories.includes(item.slug)) {
      return {
        ...category,
        category_type: "primary",
        number_of_products: products,
      };
    }

    return {
      ...category,
      category_type: "secondary",
      number_of_products: products,
    };
  });

  console.log(JSON.stringify(dataForDB, undefined, 4));

  res.send("Hello World");
});

app.listen({ port: PORT }, () => {
  console.log(`Server listening on port ${PORT}`);
});
