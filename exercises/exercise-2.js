const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  // creates a new client
  const client = await MongoClient(MONGO_URI, options);
  try {
    // connect to the client
    await client.connect();
    // We are using the 'exercises' database
    const db = client.db("exercise_2");
    console.log("connected!");
    // and creating a new collection 'greetings'
    const result = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, result.insertedCount);
    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  // close the connection to the database server
  client.close();
  console.log("disconnected!");
};

const getGreeting = async (req, res) => {
  const _id = req.params._id;
  // creates a new client
  const client = await MongoClient(MONGO_URI, options);
  try {
    // connect to the client
    await client.connect();
    // We are using the 'exercises' database
    const db = client.db("exercise_2");
    console.log("connected!");
    // and creating a new collection 'greetings'
    // const result = await db.collection("greetings").findOne({ _id });
    // console.log(result);
    db.collection("greetings").findOne({ _id }, (err, result) => {
      console.log(_id, result);
      result
        ? res.status(200).json({ status: 200, _id, data: result })
        : res.status(404).json({ status: 404, _id, data: "Not Found" });
      // close the connection to the database server
      client.close();
    });
  } catch (err) {
    console.log(err.stack);
  }
};

const getGreetings = async (req, res) => {
  let { start, limit } = req.query;
  start = Number(start);
  limit = Number(limit);
  console.log(start, limit);
  // creates a new client
  const client = await MongoClient(MONGO_URI, options);
  try {
    // connect to the client
    await client.connect();
    // We are using the 'exercises' database
    const db = client.db("exercise_2");
    console.log("connected!");
    // and creating a new collection 'greetings'
    const greetings = await db.collection("greetings").find().toArray();
    let data = [];
    if (greetings.length > 0) {
      if (!start && !limit) {
        data = greetings.slice(0, 25);
      } else if (start && !limit) {
        data = greetings.slice(start, start + 25);
      } else if (!start && limit) {
        data = greetings.slice(0, limit);
      } else {
        data = greetings.slice(start, start + limit);
        console.log(data);
      }
      return res.status(200).json({ status: 200, data: data });
    } else {
      return res.status(404).json({ status: 404, data: "Not Found" });
    }
  } catch (err) {
    console.log(err.message);
  }
  // close the connection to the database server
  client.close();
  console.log("disconnected!");
};

const deleteGreeting = async (req, res) => {
  const _id = req.params._id;
  // creates a new client
  const client = await MongoClient(MONGO_URI, options);
  try {
    // connect to the client
    await client.connect();
    // We are using the 'exercises' database
    const db = client.db("exercise_2");
    console.log("connected!");
    // and creating a new collection 'greetings'
    console.log(_id);
    const result = await db.collection("greetings").deleteOne({ _id });
    assert.equal(1, result.deletedCount);
    res
      .status(200)
      .json({ status: 204, message: `${_id} successfully deleted` });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }
  // close the connection to the database server
  client.close();
  console.log("disconnected!");
};

module.exports = { createGreeting, deleteGreeting, getGreeting, getGreetings };
