const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const assert = require("assert");
// // MONGO ^^

const router = require("express").Router();
const { getSeats, updateSeat } = require("./handlers");

// Code that is generating the seats.
// ----------------------------------
const seats = {};
const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
for (let r = 0; r < row.length; r++) {
  for (let s = 1; s < 13; s++) {
    seats[`${row[r]}-${s}`] = {
      price: 225,
      isBooked: false,
    };
  }
}
const seatsArray = [];
Object.keys(seats).forEach((seat) => {
  seatsArray.push({
    _id: seat,
    seatId: seat,
    ...seats[seat],
  });
});
console.log(seatsArray)
// ----------------------------------
//////// HELPERS

router.get("/api/seat-availability", getSeats);

router.post("/api/book-seat", updateSeat);

module.exports = router;

const batchImport = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();

    const db = client.db("6-2");

    const dataSeats = await db.collection("seats").insertMany(seatsArray);
    assert.equal(seatsArray.length, dataSeats.insertedCount);

    console.log("success");
  } catch (err) {
    console.log(err.message);
  }
  client.close();
};

batchImport();
