const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.texip.mongodb.net/volunteerNetwork?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const EventsCollection = client.db("volunteerNetwork").collection("events");
  const volunteerCollection = client
    .db("volunteerNetwork")
    .collection("volunteer");

  app.post("/addEvents", async (req, res) => {
    console.log(req.body);
    const result = await EventsCollection.insertOne(req.body);
    res.send(result);
    console.log(result);
  });

  // get search events
  app.get("/eventsSearch", async (req, res) => {
    const searchResult = await EventsCollection.find({
      title: { $regex: req.query.search },
    }).toArray();
    res.send(searchResult);
  });

  // get all events

  app.get("/allEvents", async (req, res) => {
    const result = await EventsCollection.find({}).toArray();
    res.send(result);
  });

  // delete servers

  // add addVolunteer

  app.post("/addVolunteer", async (req, res) => {
    const result = await volunteerCollection.insertOne(req.body);
    res.send(result);
    console.log(result);
  });

  // get all volunteer
  app.get("/allVolunteer", async (req, res) => {
    const result = await volunteerCollection.find({}).toArray();
    res.send(result);
  });
});

app.listen(process.env.PORT || port);
