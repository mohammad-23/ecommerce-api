import user from "../controllers/user";

module.exports = (app) => {
  app.get("/api/user", (req, res, next) => {
    user.getUser(req, res, next);
  });
};
