import { Router } from "express";
import {Slide} from "../lib/models.js";

const slidesRouter = Router();

slidesRouter.get("/", async (req, res) => {
  return res.json(req.playlist.slides);
});

slidesRouter.post("/", async (req, res) => {
  const { title, value, type } = req.body;
  if (!title || !value || !type) {
    res.status(401);
    return res.json({ msg: "please provide a title, type and a value" });
  }
  const slide = await Slide.create({ title, value, type })
  req.playlist.slides.push(slide._id);
  await req.playlist.save();

  return res.json(slide);
});
slidesRouter.get("/:slideId", async (req, res) => {
  const slide = req.playlist.slides.id(req.params.slideId);
  return res.json(slide);
});
slidesRouter.put("/:slideId", async (req, res) => {
  const playlist = req.playlist;
  const slide = playlist.slides.id(req.params.slideId);
  if (req.body.title){
    slide.title = req.body.title;
  }
  if (req.body.value){
    slide.value = req.body.value;
  }
  const result = await playlist.save();
  return res.json(result);
});

slidesRouter.delete("/:slideId", async (req, res) => {
  const playlist = req.playlist;
  playlist.depopulate("slides");
  playlist.slides = playlist.slides.filter(slide=>{
    return slide && slide.toString() !== req.params.slideId;
  });
  await playlist.save()
  return res.json(playlist);
});

export default slidesRouter;
