const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
  try {
    app.post("/social-status", async (req, res) => {
      const body = req.body;
      const date = new Date().toLocaleTimeString("en-US");
      const userPost = { ...body, date };
      const result = await socialPostCollection.insertOne(userPost);
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
