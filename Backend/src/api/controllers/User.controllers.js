const { generateSign } = require("../../config/jwt");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

//get
const getUser = async (req, res, next) => {
  try {
    const user = await User.find();
    return res.status(200).json(user);
  }
  catch (error) {
    return res.status(400).json("Error : " + error.message);
  }
};

//Registro
const registerUser = async (req, res, next) => {
  try {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });

    const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser) {
      return res.status(400).json({ message: "Este usuario ya existe" });
    }

    const userSaved = await newUser.save();

    return res.status(201).json(userSaved);
  }
  catch (error) {
    return res.status(400).json("Error : " + error.message);
  }
};

//Login
const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json({ message: "Este usuario no existe" });
    }

    const passwordMatch = bcrypt.compareSync(req.body.password, user.password);

    if (passwordMatch) {
      const token = generateSign(user._id);
      console.log({ user, token });
      return res.status(200).json({ user, token });
    }
    else {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
  }
  catch (error) {
    return res.status(500).json({ message: "Ocurrió un error inesperado. Inténtalo nuevamente más tarde." });
  }
};

// Cambiar Roles
const updateUserRoles = async (req, res) => {

  try {
    const { id } = req.params;

    const userToUpdate = await User.findById(id);

    if (!userToUpdate) {
      return res.status(404).json("Usuario no encontrado");
    }

    userToUpdate.role = req.body.role;
    await userToUpdate.save();
    return res.status(200).json(userToUpdate);
  }
  catch (error) {
    return res.status(500).json("Error");
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role === "admin" || req.user._id.toString() === id) {

      const userToDelete = await User.findByIdAndDelete(id);

      if (!userToDelete) {
        return res.status(404).json("Usuario no encontrado");
      }

      return res.status(200).json("Usuario eliminado correctamente");
    } else {
      return res.status(403).json("No tienes permisos para eliminar este usuario");
    }
  }
  catch (error) {
    return res.status(500).json("Error");
  }
};

module.exports = {
  getUser,
  registerUser,
  loginUser,
  updateUserRoles,
  deleteUser,
}