const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
var cors = require("cors");
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yblkal7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  const database = client.db("phero-job-task");
  const socialPostCollection = database.collection("social-post");
  const commentCollection = database.collection("comment");
  const aboutCollection = database.collection("about");
  try {
    app.post("/social-status", async (req, res) => {
      const body = req.body;
      const date = new Date().toLocaleTimeString("en-US");
      const userPost = { ...body, date };
      const result = await socialPostCollection.insertOne(userPost);
      res.send(result);
    });
    app.post("/social-status/comment", async (req, res) => {
      const commentBody = req.body;
      const result = await commentCollection.insertOne(commentBody);
      res.send(result);
    });
    app.get("/comments/:postId", async (req, res) => {
      const postId = req.params.postId;
      console.log("post id".postId);
      const filter = { postId };
      const result = await commentCollection.find(filter).toArray();
      res.send(result);
    });
    app.get("/about", async (req, res) => {
      const query = {};
      const result = await aboutCollection.find(query).toArray();
      res.send(result);
    });
    app.patch("/about/:id", async (req, res) => {
      const aboutId = req.params.id;

      const updateInfo = req.body;
      const query = { _id: new ObjectId(aboutId) };
      const updateDoc = {
        $set: updateInfo,
      };
      const result = await aboutCollection.updateOne(query, updateDoc);
      res.send(result);
    });
    app.patch("/social-status/:id", async (req, res) => {
      const id = req.params.id;
      const likeByUser = req.body;
      const filter = { _id: new ObjectId(id) };
      const result = await socialPostCollection.updateOne(filter, {
        $addToSet: { likeByUser },
      });
      res.send(result);
    });
    app.get("/social-status/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await socialPostCollection.findOne(filter);
      res.send(result);
    });
    app.get("/social-status", async (req, res) => {
      const query = {};
      const result = await socialPostCollection
        .find(query)
        .sort({ date: -1 })
        .toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.log(error));
app.get("/", (req, res) => {
  res.send("api loading");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
