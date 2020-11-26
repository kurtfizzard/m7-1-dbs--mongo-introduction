const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const fs = require("fs");

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const batchImport = async () => {
  // TODO: connect...
  // creates a new client
  const client = await MongoClient(MONGO_URI, options);
  try {
    // connect to the client
    await client.connect();
    // TODO: declare 'db'
    // We are using the 'exercises' database
    const db = client.db("exercise_2");
    console.log("connected!");
    // and creating a new collection 'greetings'
    const result = await db.collection("greetings").insertMany(greetings);
    // assert.equal(result.insertedCount);
    console.log(result);
    console.log("success");
  } catch (err) {
    console.log(err.stack);
  }
  // TODO: close...
  // close the connection to the database server
  client.close();
  console.log("disconnected!");
};

batchImport();
