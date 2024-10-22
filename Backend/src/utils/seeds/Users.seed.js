const mongoose = require("mongoose");
const User = require("../../api/models/User.model.js");
const users = require("../../data/users.js");

mongoose
  .connect("mongodb+srv://kiger22:96xmkxoEcm5Rogwn@cluster0.b7lim.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Conectado a MongoDB"))
  .then(async () => {
    const allUser = await User.find();
    if (allUser.length) {
      await User.collection.drop();
      console.log("users Borrads...");
    }
  })
  .catch((err) => console.log(`Error al borrar datos: ${err}`))
  .then(async () => {
    await User.insertMany(users);
    console.log("users Insertados...");
  })
  .catch((err) => console.log(`Error al insertar datos: ${err}`))
  .finally(() => {
    mongoose.disconnect();
    console.log("Desconectado de MongoDB");
  });