const { isAdmin } = require("../../middlewares/auth");
const {
  registerUser,
  loginUser,
  deleteUser,
  updateUserRoles,
  getUser
} = require("../controllers/User.controllers");

const userRoutes = require("express").Router();

userRoutes.get("/", getUser);
userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.put("/:id/role", [isAdmin], updateUserRoles);
userRoutes.delete("/:id", deleteUser);

module.exports = userRoutes;