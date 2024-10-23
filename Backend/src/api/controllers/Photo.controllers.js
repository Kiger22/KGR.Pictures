const { deleteImgCloudinary } = require("../../utils/dltCldry");
const Album = require("../models/Album.model");
const Photo = require("../models/Photo.model");
const User = require("../models/User.model");

//Obtener fotos
const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find()
      .populate("album", "title")
      .populate("likes", "username")
      .populate("owner", "username email");
    return res.status(200).json(photos);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las fotos." });
  }
};

//Obtener una foto por ID
const getPhotoById = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findById(id)
      .populate("album", "title")
      .populate("likes", "username")
      .populate("owner", "username email");
    if (!photo) {
      return res.status(404).json({ message: "Foto no encontrada." });
    }

    return res.status(200).json(photo);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la foto." });
  }
};

//Agregar una foto a un Album
const addPhotoToAlbum = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { albumId } = req.params;
    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ message: "Album no encontrado." });
    };

    // Verificar si el usuario existe
    const userId = req.user.id;  // Asumiendo que el ID del usuario está disponible en req.user
    const owner = await User.findById(userId);

    if (!owner) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const newPhoto = new Photo({
      title,
      description,
      imageUrl: req.file.path,
      album: album._id,
      likes: [],
      owner: owner._id,
    });

    //Guardar foto
    const savedPhoto = await newPhoto.save();

    // Añadir la id de la foto al album
    album.photos.push(savedPhoto._id);
    await album.save();
    res.status(201).json({ message: "Foto agregada correctamente", photo: savedPhoto, album: album });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar la foto al album." });
  }
};

// Agregar múltiples fotos a un álbum
const addPhotosToAlbum = async (req, res) => {
  try {
    const { title, description } = req.body; // Se puede usar el mismo título y descripción para todas, o adaptarlo según cada foto
    const { albumId } = req.params;
    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ message: "Álbum no encontrado." });
    };

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No se subieron fotos." });
    }

    const savedPhotos = [];

    // Iterar sobre cada archivo subido y crear una nueva foto
    for (let file of req.files) {
      const newPhoto = new Photo({
        title, // Si quieres un título específico por cada foto
        description, // Lo mismo con la descripción
        imageUrl: file.path, // Enlace de la imagen en Cloudinary
        album: album._id,
      });

      // Guardar la foto en la base de datos
      const savedPhoto = await newPhoto.save();
      savedPhotos.push(savedPhoto);

      // Añadir la ID de la foto al álbum
      album.photos.push(savedPhoto._id);
    }

    // Guardar el álbum actualizado
    await album.save();

    res.status(201).json({ message: "Fotos agregadas correctamente", photos: savedPhotos, album: album, });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar las fotos al álbum." });
  }
};

// Dar like a una foto
const toggleLikeOnPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user._id;

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: "Foto no encontrada." });
    }

    // Verificar si el usuario ya ha dado like a la foto
    const userIndex = photo.likes.indexOf(userId);

    if (userIndex === -1) {
      // Agregar like
      await Photo.updateOne(
        { _id: photoId },
        { $push: { likes: userId } }
      );
    } else {
      // Quitar like
      await Photo.updateOne(
        { _id: photoId },
        { $pull: { likes: userId } }
      );
    }

    // Obtener el número de likes actualizado
    const isLikedPhoto = await Photo.findById(photoId).select("likes");
    const updatedPhoto = await Photo.findById(photoId);
    res.status(200).json({ message: "Like actualizado", likes: isLikedPhoto.likes.length, photo: updatedPhoto.title });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el like." });
  }
};

// Obtener el número de likes actualizado
const getLikesCount = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photoLikes = await Photo.findById(photoId).select("likes");
    const photo = await Photo.findById(photoId);

    if (!photoLikes) {
      return res.status(404).json({ message: "Foto no encontrada." });
    };

    // Obtener el número de likes actualizado
    const likesCount = photoLikes.likes.length;
    res.status(200).json({
      message: "Número de likes actualizado",
      photo: photo.title,
      likes: likesCount,
      photoId: photoId,
      userId: req.user._id,
      isLiked: req.user._id && photoLikes.likes.includes(req.user._id), // Si el usuario está en la lista de likes de la foto
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el número de likes." });
  }
};

/* const getMostLikedPhotos = async (req, res) => {
  try {
    const photos = await Photo.aggregate([
      {
        $project: {
          title: 1,
          description: 1,
          imageUrl: 1,
          album: 1,
          likesCount: { $size: "$likes" }  // Calcula la cantidad de likes
        }
      },
      { $sort: { likesCount: -1 } },  // Ordenar por la cantidad de likes
      { $limit: 10 }  // Limitar a 10 fotos
    ]);

    res.status(200).json(photos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener fotos populares." });
  }
}; */

// Eliminar una foto de la base de datos
const deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const deletedPhoto = await Photo.findByIdAndDelete(photoId);

    if (!deletedPhoto) {
      return res.status(404).json({ message: "Foto no encontrada." });
    };

    // Eliminar la id de la foto del album
    if (deletedPhoto.imageUrl) {
      console.log("URL de la imagen a eliminar:", deletedPhoto.imageUrl);
      await deleteImgCloudinary(deletedPhoto.imageUrl);
    }

    res.status(200).json({ message: "Foto eliminada correctamente", data: deletedPhoto.imageUrl });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar" });
  }
};

module.exports = {
  getPhotos,
  getPhotoById,
  addPhotoToAlbum,
  addPhotosToAlbum,
  toggleLikeOnPhoto,
  getLikesCount,
  deletePhoto,
};