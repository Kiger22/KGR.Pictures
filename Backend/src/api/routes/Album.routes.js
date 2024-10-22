const { upload } = require("../../middlewares/file");
const { getAlbum, getAlbumById, getAlbumTitle, getAlbumByOwner, getAlbumIsPublic, postAlbum, deleteAlbum, putAlbum } = require("../controllers/Album.controller");

const albumRoutes = require("express").Router();

// Define routes
albumRoutes.get("/", getAlbum);
albumRoutes.get("/:id", getAlbumById);
albumRoutes.get("/title/:title", getAlbumTitle);
albumRoutes.get("/owner/:owner", getAlbumByOwner);
albumRoutes.get("/ispublic/:isPublic?", getAlbumIsPublic);
albumRoutes.post("/", upload.single("imgUrl"), postAlbum);
albumRoutes.put("/:id", upload.single("imgUrl"), putAlbum);
albumRoutes.delete("/:id", deleteAlbum);


module.exports = albumRoutes;