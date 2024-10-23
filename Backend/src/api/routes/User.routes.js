const { isAdmin, isAuth } = require("../../middlewares/auth");
const {
  registerUser,
  loginUser,
  deleteUser,
  updateUserRoles,
  getUser
} = require("../controllers/User.controllers");

const userRoutes = require("express").Router();

userRoutes.get("/", [isAdmin], getUser);
userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.put("/:id/role", [isAdmin], updateUserRoles);
userRoutes.delete("/:id", [isAuth], deleteUser);

module.exports = userRoutes;