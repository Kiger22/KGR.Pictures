const { deleteImgCloudinary } = require("../../utils/dltCldry");
const Album = require("../models/Album.model");
const User = require("../models/User.model");

// Obtener Álbumes 
const getAlbum = async (req, res, next) => {
  try {
    // Realizar la búsqueda de todos los álbumes y relacionar los campos "owner" y "photos"
    const albums = await Album.find()
      .populate("owner", "username email")        // Relacionar el usuario propietario (solo mostrando username y email)
      .populate("photos", "title description")   // Relacionar las fotos (solo mostrando title y description)
      .populate("sharedWith", "username email");  // Relacionar los usuarios compartidos (solo mostrando username y email)
    return res.status(200).json(albums);
  } catch (error) {
    return res.status(400).json("Algo ha ocurrido al obtener los albums");
  }
};

// Obtener un Album por su ID
const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id)
      .populate("owner", "username email")
      .populate("photos", "title description")
      .populate("sharedWith", "username email");
    return res.status(200).json(album);
  } catch (error) {
    return res.status(400).json("Algo ha ocurrido al obtener el album con id: " + id);
  }
}

// Obtener Album por su titulo
const getAlbumTitle = async (req, res, next) => {
  try {
    const { title } = req.params;
    const album = await Album.findOne({ title })
      .populate("owner", "username email")
      .populate("photos", "title description")
      .populate("sharedWith", "username email");
    return res.status(200).json(album);
  } catch (error) {
    return res.status(400).json("Algo ha ocurrido al obtener el album con título: " + title);
  }
};

// Obtener Album por su propietario
const getAlbumByOwner = async (req, res, next) => {
  try {
    const { ownerId } = req.params;
    const albums = await Album.find({ owner: ownerId })
      .populate("owner", "username email")
      .populate("photos", "title description")
      .populate("sharedWith", "username email");
    return res.status(200).json(albums);
  } catch (error) {
    return res.status(400).json("Algo ha ocurrido al obtener los albums del propietario con id: " + ownerId);
  }
};

//Obtener Álbumes Públicos 
const getAlbumIsPublic = async (req, res, next) => {
  try {
    // Convertir el valor del parámetro isPublic a booleano
    const isPublic = req.params.isPublic !== 'false'; // Cualquier valor diferente de 'false' será tratado como true

    // Buscar álbumes por el valor booleano de isPublic
    const albums = await Album.find({ isPublic: isPublic })
      .populate("owner", "username email")
      .populate("photos", "title description")
      .populate("sharedWith", "username email");

    // Retornar los álbumes encontrados
    return res.status(200).json(albums);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: `Algo ha ocurrido al obtener los albums con isPublic: ${req.params.isPublic}` });
  }
};

// Crear nuevo Album   
const postAlbum = async (req, res, next) => {
  try {
    const { title, description, isPublic } = req.body;

    // Verificar si el usuario existe
    const userId = req.user.id;  // Asumiendo que el ID del usuario está disponible en req.user
    const owner = await User.findById(userId);

    if (!owner) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Crear el nuevo álbum con los datos proporcionados y el ID del usuario propietario
    const newAlbum = new Album({
      title,
      description: description || "", // La descripción es opcional
      owner: owner._id,               // Asigna el ID del usuario como propietario
      photos: [],                     // Inicialmente, no hay fotos en el álbum
      isPublic: isPublic || false,    // El álbum es privado por defecto
    });

    // Subir la imagen del álbum (si hay) al directorio de imágenes
    if (req.file && req.file.path) {
      newAlbum.imgUrl = req.file.path;  // Guardar la URL pública de la imagen de Cloudinary
    }

    // Guardar el álbum en la base de datos y retornar el resultado
    const savedAlbum = await newAlbum.save();
    return res.status(201).json({ message: "Álbum creado exitosamente", savedAlbum });
  }
  catch (error) {
    return res.status(400).json("Ha ocurrido un error al crear un nuevo album");
  }
}

// Compartir Album
const shareAlbum = async (req, res) => {
  try {
    /*  // Verificar que el usuario esté autenticado
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Autenticación requerida" });
      } */

    const { albumId } = req.params;
    const { username } = req.body;

    // Verificar que el destinatario existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Destinatario no encontrado" });
    };

    // Verificar que el álbum existe
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: "Álbum no encontrado" });
    };

    // Verificar si el álbum ya está compartido con el destinatario
    const isShared = await Album.findOne({ _id: albumId, user });
    if (isShared) {
      return res.status(400).json({ message: "El álbum ya está compartido con este destinatario" });
    };

    // Añadir el destinatario al álbum
    const updatedAlbum = await Album.findByIdAndUpdate(
      albumId,
      { $addToSet: { sharedWith: user._id } },
      { new: true }
    );

    // Si se ha actualizado correctamente, retornar el álbum actualizado
    //console.log(updatedAlbum);
    return res.status(200).json({ message: "Álbum compartido con:", sharedWhit: { username } });
  }
  catch {
    return res.status(400).json("Ha ocurrido un error al compartir el álbum");
  }
};

// Obtener Albums compartidos
const getSharedAlbums = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Buscar los álbumes con quien comparten el usuario 
    const sharedAlbums = await Album.find({ sharedWith: userId })
      .populate('owner', 'username email')
      .populate('photos', 'title description imageUrl')
      .populate("sharedWith", "username email");

    res.status(200).json(sharedAlbums);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener los albums compartidos" });
  }
};

// Actualizar Album
const putAlbum = async (req, res) => {
  try {
    /*  // Verificar que el usuario esté autenticado
     if (!req.user || !req.user.id) {
       return res.status(401).json({ message: "Autenticación requerida" });
     } */

    const albumId = req.params.id;  // ID del álbum que se desea actualizar
    const { title, description, isPublic } = req.body;

    // Verificar que el álbum exista
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: "Álbum no encontrado" });
    };

    // Objeto con los datos a actualizar (solo los que están presentes)
    const updateData = {};

    // Solo actualiza los campos que están presentes
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (typeof isPublic !== 'undefined') updateData.isPublic = isPublic;

    // Si se subió una nueva portada (archivo)
    if (req.file) {
      updateData.imgUrl = req.file.path;
    }

    // Actualizar el álbum y verificar que el usuario sea el propietario
    const updatedAlbum = await Album.findOneAndUpdate(
      { _id: albumId/* , owner: req.user.id */ }, // Verifica que el usuario sea el propietario
      { $set: updateData }, // Campos a actualizar
      { new: true } // Devuelve el álbum actualizado
    );
    console.log(updatedAlbum); //

    if (!updatedAlbum) {
      return res.status(404).json({ message: "Álbum no encontrado o no tienes permisos para actualizarlo" });
    }

    return res.status(200).json({ message: "Álbum actualizado exitosamente", album: updatedAlbum });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el álbum" });
  }
};

// Eliminar Album
const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedAlbum = await Album.findByIdAndDelete(id);

    if (!deletedAlbum) {
      return res.status(404).json("El album no existe");
    }

    // Eliminar la imagen del álbum (si hay) de Cloudinary
    if (deletedAlbum.imgUrl) {
      console.log("URL de la imagen a eliminar:", deletedAlbum.imgUrl);
      await deleteImgCloudinary(deletedAlbum.imgUrl);
    }

    return res.status(200).json({ message: "Álbum eliminado correctamente", album: deletedAlbum, });
  }
  catch (error) {
    return res.status(400).json(error);
  }
}

module.exports = {
  getAlbum,
  getAlbumById,
  getAlbumTitle,
  getAlbumByOwner,
  getAlbumIsPublic,
  getSharedAlbums,
  putAlbum,
  postAlbum,
  shareAlbum,
  deleteAlbum
};