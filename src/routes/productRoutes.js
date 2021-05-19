import products from "../controllers/products";

module.exports = (app) => {
  app.get("/api/products", (req, res, next) => {
    products.getProducts(req, res, next);
  });

  app.get("/api/products/:id", (req, res, next) => {
    products.getProductDetails(req, res, next);
  });
};
