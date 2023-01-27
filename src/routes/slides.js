import { Router } from "express";
import { Slide } from "../lib/models.js";

const slidesRouter = Router();

slidesRouter.get("/", async (req, res) => {
  const slides = await Slide.find();
  return res.json(slides);
});

slidesRouter.get("/:slideId", async (req, res) => {
  const slide = await Slide.findById(req.params.slideId);
  return res.json(slide);
});
slidesRouter.put("/:slideId", async (req, res) => {
  await Slide.findByIdAndUpdate(req.params.slideId, req.body);
  const slide = await Slide.findById(req.params.slideId);
  return res.json(slide);
});

export default slidesRouter;
