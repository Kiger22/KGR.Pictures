const { isAuth, isAdmin } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/file");
const {
  getAlbum,
  getAlbumById,
  getAlbumTitle,
  getAlbumByOwner,
  getAlbumIsPublic,
  postAlbum,
  deleteAlbum,
  putAlbum,
  shareAlbum,
  getSharedAlbums
} = require("../controllers/Album.controller");

const albumRoutes = require("express").Router();

// Define routes
albumRoutes.get("/", getAlbum);
albumRoutes.get("/:id", getAlbumById);
albumRoutes.get("/title/:title", getAlbumTitle);
albumRoutes.get("/owner/:owner", getAlbumByOwner);
albumRoutes.get("/ispublic/:isPublic?", [isAuth], getAlbumIsPublic);
albumRoutes.get("/shared", [isAuth], getSharedAlbums);
albumRoutes.post("/", [isAuth], upload("albumPhotos").single("imgUrl"), postAlbum);
albumRoutes.put("/:albumId/share", shareAlbum);
albumRoutes.put("/:id", [isAuth], upload("albumPhotos").single("imgUrl"), putAlbum);
albumRoutes.delete("/:id", [isAuth], deleteAlbum);


module.exports = albumRoutes;