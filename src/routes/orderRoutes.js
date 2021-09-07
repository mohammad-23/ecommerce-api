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

  app.post("/api/create-checkout-session", (req, res, next) => {
    orders.createCheckoutSession(req, res, next);
  });

  app.post("/api/stripe-webhook", (req, res, next) => {
    orders.handleStripeWebhook(req, res, next);
  });
};
