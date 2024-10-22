require('dotenv').config();  // Cargar variables del archivo .env
const cloudinary = require("cloudinary").v2;

// Configuración de Cloudinary para subir imágenes al Cloud Storage
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY
})

// Exportar la instancia de Cloudinary para usarla en otros archivos
module.exports = cloudinary;