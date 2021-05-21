import products from "../controllers/products";

module.exports = (app) => {
  app.get("/api/products", (req, res, next) => {
    products.getProducts(req, res, next);
  });

  app.get("/api/products/:id", (req, res, next) => {
    products.getProductDetails(req, res, next);
  });

  app.get("/api/favourites", (req, res, next) => {
    products.getFavourites(req, res, next);
  });

  app.get("/api/hot-deals", (req, res, next) => {
    products.getHotDeals(req, res, next);
  });
};
