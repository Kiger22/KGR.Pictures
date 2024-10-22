
require("dotenv").config();
const express = require("express");

const app = express();
const router = express.Router();

PORT = process.env.PORT || 3000;

const { connectDB } = require("./src/config/db");
const albumRoutes = require("./src/api/routes/Album.routes");
const userRoutes = require("./src/api/routes/User.routes");
connectDB();

app.use(express.json());

// Rutas
app.use("/", router);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/album", albumRoutes);

app.use("*", (req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  return res.status(error.status || 500).json(error.message || "Unexpected error");
});

app.listen(3000, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
