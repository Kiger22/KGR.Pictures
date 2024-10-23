const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cldry");

// Función para configurar multerStorage de forma dinámica

const multerStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,//Carpeta dinámica.
      allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],  // Formatos permitidos
    },
  });
}


// Configurar multer con el storage definido anteriormente
const upload = (folderName) => multer({ storage: multerStorage(folderName) });

// Exportar el middleware para subir imágenes
module.exports = { upload };
