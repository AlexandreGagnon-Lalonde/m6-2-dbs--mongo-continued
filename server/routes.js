// const fs = require("file-system");
// const { MongoClient } = require("mongodb");
// require("dotenv").config();
// const { MONGO_URI } = process.env;
// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };
// const assert = require("assert");
// // MONGO ^^

const router = require("express").Router();
const { getSeats, updateSeat } = require("./handlers");

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

// // Code that is generating the seats.
// // ----------------------------------
// const seats = {};
// const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
// for (let r = 0; r < row.length; r++) {
//   for (let s = 1; s < 13; s++) {
//     seats[`${row[r]}-${s}`] = {
//       price: 225,
//       isBooked: false,
//     };
//   }
// }
// const seatsArray = [];
// Object.keys(seats).forEach((seat) => {
//   seatsArray.push({
//     _id: seat,
//     ...seats[seat],
//   });
// });
// // ----------------------------------
//////// HELPERS
const getRowName = (rowIndex) => {
  return String.fromCharCode(65 + rowIndex);
};

const randomlyBookSeats = (num) => {
  const bookedSeats = {};

  while (num > 0) {
    const row = Math.floor(Math.random() * NUM_OF_ROWS);
    const seat = Math.floor(Math.random() * SEATS_PER_ROW);

    const seatId = `${getRowName(row)}-${seat + 1}`;

    bookedSeats[seatId] = true;

    num--;
  }

  return bookedSeats;
};

let state;

router.get("/api/seat-availability", getSeats);

let lastBookingAttemptSucceeded = false;

router.post("/api/book-seat", updateSeat);

module.exports = router;

// const batchImport = async (req, res) => {
//   const client = await MongoClient(MONGO_URI, options);
//   try {
//     await client.connect();
// poor choice of databse name...
//     const db = client.db("6-2--exercise_1");

//     const dataSeats = await db.collection("seats").insertMany(seatsArray);
//     assert.equal(seatsArray.length, dataSeats.insertedCount);

//     console.log("success");
//   } catch (err) {
//     console.log(err.message);
//   }
//   client.close();
// };

// batchImport();
