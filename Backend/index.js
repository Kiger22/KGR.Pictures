
require("dotenv").config();
const express = require("express");

const app = express();
const router = express.Router();
app.use(express.json());

PORT = process.env.PORT || 3000;

// Conexión a la base de datos
const { connectDB } = require("./src/config/db");
connectDB();

// Rutas
const albumRoutes = require("./src/api/routes/Album.routes");
const userRoutes = require("./src/api/routes/User.routes");
const photosRoutes = require("./src/api/routes/Photo.routes");

app.use("/", router);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/album", albumRoutes);
app.use("/api/v1/photo", photosRoutes);

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
