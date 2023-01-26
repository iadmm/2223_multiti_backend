import { ObjectId } from "mongodb";
import { Router } from "express";
import { getCurrentPlaylist } from "../lib/queries.js";

const slidesRouter = Router();
slidesRouter.get("/", async (req, res) => {
  const slides = await req.context.db.collection("slides").find().toArray();
  return res.json(slides);
});
slidesRouter.post("/", async (req, res) => {
  const { title, value } = req.body;
  if (!title || !value) {
    res.status(401);
    return res.json({ msg: "please provide a title and a value" });
  }
  const currentPlaylist = await getCurrentPlaylist(req.context.db);
  const slide = await req.context.db
    .collection("slides")
    .insertOne({ title, value, playlist: currentPlaylist._id });

  return res.json(slide);
});
slidesRouter.delete("/:slideId", async (req, res) => {
  const slideId = req.params.slideId;
  if (!slideId) {
    return res.json({ msg: "nok" });
  }
  const slide = await req.context.db
    .collection("slides")
    .deleteOne({ _id: new ObjectId(slideId) });
  return res.json(slide);
});

export default slidesRouter;
