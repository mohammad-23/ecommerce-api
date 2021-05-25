import user from "../controllers/user";

module.exports = (app) => {
  app.get("/api/user", (req, res, next) => {
    user.getUser(req, res, next);
  });

  app.get("/api/users", (req, res, next) => {
    user.checkUser(req, res, next);
  });

  app.put("/api/users", (req, res, next) => {
    user.updateUser(req, res, next);
  });
};
