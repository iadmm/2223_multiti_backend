import { Router } from "express";
import { Slide } from "../lib/models.js";
import { unfurl } from "unfurl.js";
import {removeSlideFromPlaylist} from "../lib/queries.js";

const slidesRouter = Router();

slidesRouter.get("/", async (req, res) => {
  return res.json(req.playlist.slides);
});

slidesRouter.post("/", async (req, res) => {
  const { value } = req.body;
  if (!value) {
    res.status(401);
    return res.json({ msg: "please provide a value" });
  }
  try {
    const result = await unfurl(value);
    const image =
      Array.isArray(result.open_graph?.images) &&
      result.open_graph?.images?.length
        ? result.open_graph?.images[0]
        : null;
    const slide = await Slide.create({
      value,
      title: result.title,
      type: "video",
      image,
    });
    req.playlist.slides.push(slide._id);
    await req.playlist.save();
    return res.json(slide);
  } catch (e) {
    res.status(403);
    return res.json({ msg: "error" });
  }
});
slidesRouter.get("/:slideId", async (req, res) => {
  const slide = req.playlist.slides.id(req.params.slideId);
  return res.json(slide);
});

slidesRouter.delete("/:slideId", async (req, res) => {
  const playlist = req.playlist;
  playlist.depopulate("slides");
  playlist.slides = removeSlideFromPlaylist(playlist, req.params.slideId);
  await playlist.save();
  return res.json(playlist);
});

export default slidesRouter;
