import { Router } from "express";
import { getCurrentPlaylist, getLatestSlide } from "../lib/queries.js";

const playlistsRouter = Router();

playlistsRouter.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(401);
    return res.json({ msg: "please provide a name" });
  }
  const latestSlide = await getLatestSlide(req.context.db);

  const slide = await req.context.db.collection("playlists").insertOne({
    name,
    created_at: new Date(),
    current_slide: latestSlide._id,
  });
  req.context.io.emit()
  return res.json(slide);
});

playlistsRouter.get("/", async (req, res) => {
  const slides = await req.context.db.collection("playlists").find().toArray();
  return res.json(slides);
});

playlistsRouter.get("/current", async (req, res) => {
  const playlist = await getCurrentPlaylist(req.context.db);
  return res.json(playlist);
});

export default playlistsRouter;
