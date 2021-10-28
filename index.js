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

  // add Events
  app.post("/addEvent", async (req, res) => {
    console.log(req.body);
    const result = await EventsCollection.insertOne(req.body);
    console.log(result);
  });

  // get search events
  app.get("/searchEvent", async (req, res) => {
    const result = await EventsCollection.find({
      title: { $regex: req.query.search },
    }).toArray();
    res.send(result);
    console.log(result);
  });

  // add volunteer
  app.post("/addVolunteer", async (req, res) => {
    console.log(req.body);
    const result = await volunteerCollection.insertOne(req.body);
    res.send(result);
  });

  // get all volunteer

  app.get("/allVolunteer", async (req, res) => {
    const result = await volunteerCollection.find({}).toArray();
    res.send(result);
    console.log(result);
  });
  // get all events

  app.get("/allEvents", async (req, res) => {
    const result = await EventsCollection.find({}).toArray();
    res.send(result);
  });

  // delete event

  app.delete("/deleteEvent/:id", async (req, res) => {
    console.log(req.params.id);
    const result = await EventsCollection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });

  // my events

  app.get("/myEvents/:email", async (req, res) => {
    const result = await EventsCollection.find({
      email: req.params.email,
    }).toArray();
    res.send(result);
  });

  // add addVolunteer

  // get all volunteer
});

app.listen(process.env.PORT || port);
