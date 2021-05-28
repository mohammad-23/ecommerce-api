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

  app.post("/api/users/change-password", (req, res, next) => {
    user.changePassword(req, res, next);
  });

  app.delete("/api/users/address/:id", (req, res, next) => {
    user.deleteAddress(req, res, next);
  });
};
