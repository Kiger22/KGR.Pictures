const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imgUrl: { type: String, required: false },
    owner: { type: mongoose.Types.ObjectId, ref: "users", required: false },
    photos: [{ type: mongoose.Types.ObjectId, ref: "photos", require: false }],
    isPublic: { type: Boolean, default: false },
    sharedWith: [{ type: mongoose.Types.ObjectId, ref: "users", require: false }],
  },
  {
    timestamps: true,
    collection: "albums",
  }
);

const Album = mongoose.model("albums", albumSchema, "albums");
module.exports = Album;