import orders from "../controllers/orders";

module.exports = (app) => {
  app.get("/api/orders", (req, res, next) => {
    orders.getOrders(req, res, next);
  });

  app.post("/api/orders/create", (req, res, next) => {
    orders.createOrder(req, res, next);
  });

  app.put("/api/orders/:id", (req, res, next) => {
    orders.updateOrder(req, res, next);
  });
};
