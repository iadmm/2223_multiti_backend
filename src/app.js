const uri =
  "mongodb+srv://multiti:l2INKNKI050WFqkR@cluster0.mvxofd8.mongodb.net/?retryWrites=true&w=majority";

// or as an es module:
import { Db, MongoClient } from "mongodb";
import express from "express";

const app = express();
const port = 3000;
const dbName = "multiti";

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
  app.get("/slides", async (req, res) => {
    const slides = await req.context.db.collection("slides").find().toArray();
    return res.json(slides);
  });
  app.post("/slides", async (req, res) => {
    const {title, value} = req.body;
    if (!title || !value){
      res.status(401);
      return res.json({msg: "please provide a title and a value"});
    }
    const position = await req.context.db.collection("slides").countDocuments();
    const slide = await req.context.db.collection("slides").insertOne({title, value, position});
    return res.json(slide);
  });
  app.delete("/slides/:slideId", (req, res)=>{
    const slideId = req.params.slideId;
    if(!slideId){
      const slide = await req.context.db.collection("slides").insertOne({title, value, position});
      return res.json(slide);
    }
  });
  app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
  });
};

initDB(dbName).then((context) => {
  return Promise.all([initExpress(context)]);
});
