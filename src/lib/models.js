import { model, Schema } from "mongoose";

export const User = model("User", {
  username: {
    type: Schema.Types.String,
    required: true,
  },
  created_at: { type: Date, default: Date.now },
});

const ImageSchema = new Schema({ width: Number, height: Number, url: String });

const SlideSchema = new Schema(
  {
    title: { type: Schema.Types.String, required: true },
    image: { type: ImageSchema, required: false },
    value: { type: Schema.Types.String, required: true },
    type: { type: Schema.Types.String, required: true },
  },
  { timestamps: true }
);
export const Slide = model("Slide", SlideSchema);

//Playlist
const PlaylistSchema = new Schema({
  name: { type: Schema.Types.String, required: true },
  slides: [{ type: Schema.Types.ObjectId, ref: "Slide" }],
  history: [{ type: Schema.Types.ObjectId, ref: "Slide" }],
  currentlyPlaying: {
    required: false,
    type: Schema.Types.ObjectId,
    ref: "Slide",
  },
});
export const Playlist = model("Playlist", PlaylistSchema);
