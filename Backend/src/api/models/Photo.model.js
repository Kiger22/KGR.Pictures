const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    imageUrl: { type: String, required: false },
    album: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  },
  {
    timestamps: true,
    collection: "photos",
  }
);

const Photo = mongoose.model("photos", photoSchema, "photos");
module.exports = Photo;