const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    imageUrl: { type: String, required: false },
    album: { type: mongoose.Types.ObjectId, ref: "albums", required: false },
    likes: [{ type: mongoose.Types.ObjectId, ref: "users", require: false }],
    owner: { type: mongoose.Types.ObjectId, ref: "users", required: false },
  },
  {
    timestamps: true,
    collection: "photos",
  }
);

const Photo = mongoose.model("photos", photoSchema, "photos");
module.exports = Photo;