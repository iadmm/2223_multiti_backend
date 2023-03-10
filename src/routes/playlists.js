import { Router } from "express";
import { Playlist } from "../lib/models.js";
import slidesRouter from "./playlistSlides.js";

const playlistsRouter = Router();

playlistsRouter.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(401);
    return res.json({ msg: "please provide a name" });
  }
  const playlist = await Playlist.create({
    name,
  });
  return res.json(playlist);
});

playlistsRouter.get("/", async (req, res) => {
  const slides = await Playlist.find();
  return res.json(slides);
});

playlistsRouter.get("/current", async (req, res) => {
  const playlist = await Playlist.findOne()
    .populate("slides")
    .populate("currentlyPlaying")
    .sort({ created_at: -1 });
  return res.json(playlist);
});

playlistsRouter.get("/:playlistId", async (req, res) => {
  const playlist = await Playlist.findById(req.params.playlistId)
    .populate("slides")
    .populate("currentlyPlaying");
  return res.json(playlist);
});

playlistsRouter.delete("/:playlistId", async (req, res) => {
  const playlist = await Playlist.findByIdAndDelete(req.params.playlistId);
  return res.json(playlist);
});

playlistsRouter.use(
  "/:playlistId/slides",
  async (req, res, next) => {
    try{
      if (req.params.playlistId === "current") {

        req.playlist = await Playlist.findOne()
          .populate("slides")
          .sort({ created_at: -1 });
      } else {
        req.playlist = await Playlist.findById(req.params.playlistId).populate(
          "slides"
        );
      }
      next();
    } catch (e){
      res.status = 404;
      res.json({msg:"not found"})
    }

  },
  slidesRouter
);

export default playlistsRouter;
