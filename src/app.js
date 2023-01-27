import { MongoClient } from "mongodb";
import express from "express";
import slidesRouter from "./routes/slides.js";
import playlistsRouter from "./routes/playlists.js";
import http from 'http';
import { Server } from "socket.io";
import mongoose from "mongoose";
mongoose.connect('mongodb+srv://multiti:l2INKNKI050WFqkR@cluster0.mvxofd8.mongodb.net/?retryWrites=true&w=majority');
mongoose.set('strictQuery', false);

const uri =
    "mongodb+srv://multiti:l2INKNKI050WFqkR@cluster0.mvxofd8.mongodb.net/?retryWrites=true&w=majority";
const port = 3000;
const dbName = "multiti";
//
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const initDB = async function (dbName) {
  // Connection URL
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  return {
    db,
    client,
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
  app.use('/playlists', playlistsRouter)
  app.use('/slides', slidesRouter)

  app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
  });
};

const initSocket = (context)=>{
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
  context.io = io;
}


initDB(dbName).then(async (context) => {
  await initSocket(context);
  await initExpress(context)
});
