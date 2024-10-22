const jwt = require("jsonwebtoken");

const generateSign = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const verifyJwt = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
  catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error("El token ha expirado");
    } else {
      throw new Error("Token inválido");
    }
  }
};


module.exports = { generateSign, verifyJwt };
