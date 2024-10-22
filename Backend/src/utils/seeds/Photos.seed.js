const mongoose = require("mongoose");
const Photo = require("../../api/models/Photo.model.js");
const photos = require("../../data/photos.js");

mongoose
  .connect("mongodb+srv://kiger22:96xmkxoEcm5Rogwn@cluster0.b7lim.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Conectado a MongoDB"))
  .then(async () => {
    const allPhoto = await Photo.find();
    if (allPhoto.length) {
      await Photo.collection.drop();
      console.log("photos Borradas...");
    }
  })
  .catch((err) => console.log(`Error al borrar datos: ${err}`))
  .then(async () => {
    await Photo.insertMany(photos);
    console.log("photos insertadas...");
  })
  .catch((err) => console.log(`Error al insertar datos: ${err}`))
  .finally(() => {
    mongoose.disconnect();
    console.log("Desconectado de MongoDB");
  });

