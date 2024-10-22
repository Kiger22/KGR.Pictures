const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cldry");

// Configurar multerStorage
const multerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "photosAlbums",  // Carpeta en Cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],  // Formatos permitidos
  },
});

// Configurar multer con el storage definido anteriormente
const upload = multer({ storage: multerStorage });

// Exportar el middleware para subir imágenes
module.exports = { upload };
