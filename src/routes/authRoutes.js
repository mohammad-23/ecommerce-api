import auth from "../controllers/auth";

module.exports = (app) => {
  app.post("/api/login", (req, res, next) => {
    auth.login(req, res, next);
  });

  app.post("/api/register", (req, res, next) => {
    auth.register(req, res, next);
  });
};
