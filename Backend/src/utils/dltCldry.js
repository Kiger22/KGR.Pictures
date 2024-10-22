const cloudinary = require("../config/cldry");

const deleteImgCloudinary = async (Url) => {
  try {
    // Verificar que la URL de la imagen no esté vacía
    if (!Url) {
      console.error("La URL de la imagen no es válida");
      return;
    }

    // Dividir la URL para obtener el public_id
    const imgSplited = Url.split("/");
    const fileNameWithExt = imgSplited.at(-1); // Nombre del archivo con extensión
    const fileName = fileNameWithExt.split(".")[0]; // Nombre del archivo sin extensión
    const folderName = imgSplited.at(-2); // Nombre de la carpeta

    // Generar el public_id necesario para Cloudinary
    const public_id = `${folderName}/${fileName}`;
    console.log(public_id);

    // Usar la función destroy de Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      console.log('Imagen eliminada de Cloudinary:', public_id);
    } else {
      console.error('No se pudo eliminar la imagen de Cloudinary:', result);
    }
  }
  catch (error) {
    console.error("Error al eliminar la imagen de Cloudinary:", error);
  }
}

module.exports = { deleteImgCloudinary };
