"use strict";

const fs = require("file-system");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const assert = require("assert");

const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();

    const db = client.db("6-2--exercise_1");

    const seats = await db.collection("seats").find().toArray();

    if (seats.length === 0) {
      res.status(404).json({ status: 404, message: "No data" });
    } else {
      res.status(200).json({ status: 200, data: seats });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
  client.close();
};

const updateSeat = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  try {
    // find id of seat to update
    const { seatId } = req.body;
    // create query with mongo property
    const query = { _id: seatId };
    // value for true and false
    const newValueTrue = { $set: { isBooked: true } };
    const newValueFalse = { $set: { isBooked: false } };
    // connect client
    await client.connect();
    // find good database
    const db = client.db("6-2--exercise_1");
    // find seat to update in databse
    const currentSeat = await db.collection("seats").findOne({ _id: seatId });
    // create temp seat variable
    let seat;
    // check if seat isBooked or not
    if (currentSeat.isBooked) {
      seat = await db.collection("seats").updateOne(query, newValueFalse);
    } else {
      seat = await db.collection("seats").updateOne(query, newValueTrue);
    }
    // check that value has been updated
    assert.equal(1, seat.matchedCount);
    assert.equal(1, seat.modifiedCount);
    // server response
    res.status(204).json({ status: 204, data: currentSeat });
  } catch (err) {
    res.status(500).json({ status: 500, message: err });
  }
  client.close();
};

module.exports = { getSeats, updateSeat };
