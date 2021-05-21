import cart from "../controllers/cart";

module.exports = (app) => {
  app.get("/api/cart", (req, res, next) => {
    cart.getCart(req, res, next);
  });

  app.post("/api/cart", (req, res, next) => {
    cart.createCart(req, res, next);
  });

  app.put("/api/cart/update", (req, res, next) => {
    cart.updateCart(req, res, next);
  });

  app.put("/api/cart/clear", (req, res, next) => {
    cart.clearCart(req, res, next);
  });
};
