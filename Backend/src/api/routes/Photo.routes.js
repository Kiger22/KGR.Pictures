const { isAdmin, isAuth } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/file");
const {
  getPhotos,
  addPhotosToAlbum,
  addPhotoToAlbum,
  deletePhoto,
  toggleLikeOnPhoto,
  getLikesCount,
  getPhotoById,
} = require("../controllers/Photo.controllers");

const photosRoutes = require("express").Router();

photosRoutes.get("/", getPhotos);
photosRoutes.get("/:id", getPhotoById);
photosRoutes.get("/album/:albumId", getPhotos);
photosRoutes.post("/:albumId", [isAuth], upload("cyclistPhotos").single("imageUrl"), addPhotoToAlbum);
photosRoutes.post("/photos/:albumId", [isAuth], upload("cyclistPhotos").array("cyclist", 10), addPhotosToAlbum);
photosRoutes.put("/:photoId/like", [isAuth], toggleLikeOnPhoto);
photosRoutes.get("/:photoId/like", [isAuth], getLikesCount);
//photosRoutes.get("/popular", getMostLikedPhotos);
photosRoutes.delete("/:photoId", [isAdmin], deletePhoto);

module.exports = photosRoutes;