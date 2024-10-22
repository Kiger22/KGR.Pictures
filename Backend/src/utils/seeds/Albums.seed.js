const mongoose = require("mongoose");
const Album = require("../../api/models/Album.model.js");
const albums = require("../../data/albums.js");

mongoose
  .connect("mongodb+srv://kiger22:96xmkxoEcm5Rogwn@cluster0.b7lim.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Conectado a MongoDB"))
  .then(async () => {
    const allAlbum = await Album.find();
    if (allAlbum.length) {
      await Album.collection.drop();
      console.log("albums Borrados...");
    }
  })
  .catch((err) => console.log(`Error al borrar datos: ${err}`))
  .then(async () => {
    await Album.insertMany(albums);
    console.log("albums Insertados...");
  })
  .catch((err) => console.log(`Error al insertar datos: ${err}`))
  .finally(() => {
    mongoose.disconnect();
    console.log("Desconectado de MongoDB");
  });

