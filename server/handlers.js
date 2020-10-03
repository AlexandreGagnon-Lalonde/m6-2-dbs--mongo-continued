'use strict';

const fs = require("file-system");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();

    const db = client.db('6-2--exercise_1');

    const seats = await db.collection('seats').find().toArray();

    if (seats.length === 0) {
      res.status(404).json({ status: 404, message: 'No data' });
    } else {
      res.status(200).json({ status: 200, data: seats});
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message })
  }
  client.close();
};

module.exports = { getSeats };
