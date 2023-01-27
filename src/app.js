import express from "express";
import slidesRouter from "./routes/slides.js";
import playlistsRouter from "./routes/playlists.js";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { Playlist, Slide } from "./lib/models.js";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import cors from "cors";
dotenv.config();

mongoose.connect(process.env.DB_PATH);
mongoose.set("strictQuery", false);

const port = process.env.PORT || 3000;
//
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const initContext = async function (dbName) {
  return {
    io,
    app,
  };
};

const initExpress = (context) => {
  app.use(express.json());
  app.use((req, res, next) => {
    req.context = context;
    next();
  });
  app.get("/", (req, res) => {
    return res.json({ msg: "ok" });
  });
  app.use("/playlists", playlistsRouter);
  app.use("/slides", slidesRouter);
};

async function playSlide({ playlistId, slideId }) {
  if (slideId) {
    const slide = await Slide.findById(slideId);
    const playlist = await Playlist.findById(playlistId);
    console.log("playslide", playlist.name, slide.value);
    //playlist.slides = removeSlideFromPlaylist(playlist, slideId);
    playlist.currentlyPlaying = slide._id;
    await playlist.save();
    return io.emit("slide_playing", { playlistId, slideId });
  }
  return io.emit("slide_playing", { playlistId, slideId });
}

const initSocket = (context) => {
  context.io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
    socket.on("slide_complete", async ({ playlistId, slideId }) => {
      const playlist = await Playlist.findById(playlistId);
      playlist.history.push(slideId);
      await playlist.save();
    });
    socket.on("play_slide", playSlide);
    socket.on("play_next_slide", async ({ playlistId }) => {
      console.log("play_next_slide", { playlistId });
      const playlist = await Playlist.findById(playlistId);
      const currentSlideIndex = playlist.slides.findIndex(
        (slide) => slide.toString() === playlist.currentlyPlaying.toString()
      );
      console.log(currentSlideIndex);
      if (playlist.slides[currentSlideIndex + 1]) {
        await playSlide({
          playlistId,
          slideId: playlist.slides[currentSlideIndex + 1],
        });
      } else {
        await playSlide({ playlistId, slideId: playlist.slides[0] });
      }
    });
  });
};

initContext().then(async (context) => {
  await initSocket(context);
  await initExpress(context);
  server.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
  });
});
