const User = require("../api/models/User.model");
const { verifyJwt } = require("../config/jwt");

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ mensaje: "Token necesario" });
    }

    const { id } = verifyJwt(token);

    const user = await User.findById(id);

    if (!user) {
      return res.status(403).json({ mensaje: "No está autorizado" });
    }
    user.password = undefined;
    req.user = user;
    console.log({ UserAutenticado: id, Token: token });
    next();
  }
  catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ mensaje: "Token necesario" });
    }

    const { id } = verifyJwt(token);
    const user = await User.findById(id);

    if (user && user.role === "admin") {
      user.password = undefined;
      req.user = user;
      next();
    } else {
      return res.status(403).json({ mensaje: "No está autorizado para realizar esta acción" });
    }
  }
  catch (error) {
    return res.status(500).json({ mensaje: "Error del servidor o token inválido" });
  }
};

module.exports = {
  isAuth,
  isAdmin,
};