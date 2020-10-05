"use strict";

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

    const db = client.db("6-2");

    const seats = await db.collection("seats").find().toArray();

    const response = {};

    seats.forEach((seat) => {
      response[seat._id] = seat;
    });

    if (seats.length === 0) {
      res.status(404).json({ status: 404, message: "No data" });
    } else {
      res
        .status(201)
        .json({ status: 201, seats: response, numOfRows: 8, seatsPerRow: 12 });
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
    const { seatId, expiration, creditCard, email, fullName } = req.body;
    // check if form is filled
    if (!expiration || !creditCard || !email || !fullName) {
      res.status(404).json({ status: 404, message: "Please fill the form" });
    } else {
      // create query with mongo property
      const query = { _id: seatId };
      // value for true and false
      const newValueTrue = {
        $set: {
          isBooked: true,
          customer: {
            fullName,
            email,
          },
        },
      };
      const newValueFalse = { $set: { isBooked: false } };
      // connect client
      await client.connect();
      // find good database
      const db = client.db("6-2");
      // add new user in users database
      const newUser = await db
        .collection("users")
        .insertOne({ fullName, email });
      assert.equal(1, newUser.insertedCount);
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
      res.status(204).json({ status: 204, success: true });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
  client.close();
};

const deleteBooking = async (req, res) => {
  const { seatId } = req.body;

  try {
    const client = await MongoClient(MONOGO_URI, options);

    const query = { _id: seatId };

    const newValue = { $set: { isBooked: false, customer: null } };

    await client.connect();

    const db = client.db("6.2");

    const booking = await db.collection("seats").updateOne(query, newValue);

    assert.equal(1, booking.matchedCount);
    assert.equal(1, booking.modifiedCount);

    res.status(204).json({ status: 204 });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
  client.close();
};

const updateUser = async (req, res) => {
  const client = MongoClient(MONGO_URI, options);

  try {
    const { fullName } = req.body;
    const query = { fullName };
    const newValuesUser = {
      $set: {
        fullName: "new name",
        email: "new email",
      },
    };
    const newValuesSeat = {
      $set: {
        customer: {
          fullName: "new name",
          email: "new email",
        },
      },
    };

    await client.connect();

    const db = client.db("6.2");
    const seatData = await db
      .collection("seats")
      .updateOne(query, newValuesSeat);
    assert.equal(1, seatData.matchedCount);
    assert.equal(1, seatData.modifiedCount);

    const userData = await db
      .collection("users")
      .updateOne(query, newValuesUser);
    assert.equal(1, userData.matchedCount);
    assert.equal(1, userData.modifiedCount);

    res.status(204).json({ status: 204 });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
  client.close();
};

module.exports = { getSeats, updateSeat, updateUser, deleteBooking };
