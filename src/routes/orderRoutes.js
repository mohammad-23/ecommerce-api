import orders from "../controllers/orders";

module.exports = (app) => {
  app.get("/api/orders", (req, res, next) => {
    orders.getOrders(req, res, next);
  });

  app.get("/api/orders/create", (req, res, next) => {
    orders.createOrder(req, res, next);
  });
};
