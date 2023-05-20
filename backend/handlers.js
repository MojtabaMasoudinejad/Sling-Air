"use strict";
const { MongoClient, ObjectId } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

// returns an array of all flight numbers
const getFlights = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const flightsNumbers = [];
  try {
    await client.connect();
    const db = client.db("slingair_project");

    const result = await db.collection("flights_collection").find().toArray();

    if (result) {
      result.forEach((item) => {
        flightsNumbers.push(item.flight);
      });

      console.log(flightsNumbers);
      res.status(200).json({
        status: 200,
        data: flightsNumbers,
        message: "The Flights Numbers",
      });
    } else {
      res
        .status(404)
        .json({ status: 404, data: "The Flights Numbers Not Found" });
    }
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
};

// returns all the seats on a specified flight
const getFlight = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { selectedFlight } = req.params;
  const flightsNumber = ["SA231", "FD489"];
  try {
    await client.connect();
    const db = client.db("slingair_project");
    if (flightsNumber.includes(selectedFlight)) {
      const result = await db
        .collection("flights_collection")
        .findOne({ _id: selectedFlight });

      let flighSeats = [];
      if (result) {
        flighSeats = result.seats;
      }
      res.status(200).json({
        status: 200,
        data: flighSeats,
        message: "The Flights Seats Numbers",
      });
    } else {
      res
        .status(404)
        .json({ status: 404, data: "The Flights Seats Numbers Not Found" });
    }
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
};

// returns all reservations
const getReservations = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  // const reservationDAata = [];
  try {
    await client.connect();
    const db = client.db("slingair_project");

    const result = await db.collection("reservation_Data").find().toArray();

    if (result) {
      res.status(200).json({
        status: 200,
        data: result,
        message: "The Reservation Data",
      });
    } else {
      res
        .status(404)
        .json({ status: 404, data: "The Reservation Data Not Found" });
    }
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
};

// returns a single reservation
const getSingleReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { reservationId } = req.params;
  try {
    await client.connect();
    const db = client.db("slingair_project");

    const result = await db
      .collection("reservation_Data")
      .findOne({ _id: reservationId });

    if (result) {
      res.status(200).json({
        status: 200,
        data: result,
        message: "The Reservation Data",
      });
    } else {
      res
        .status(404)
        .json({ status: 404, data: "The Specific Reservation Data Not Found" });
    }
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
};

// creates a new reservation
const addReservation = async (req, res) => {
  const { flightNumber, flightSeat, firstName, lastName, email } = req.body;
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("slingair_project");

    const newReservation = await db.collection("reservation_Data").insertOne({
      _id: uuidv4(),
      flight: flightNumber,
      seat: flightSeat,
      givenName: firstName,
      surname: lastName,
      email: email,
    });

    const query = { _id: flightNumber, "seats.id": flightSeat };
    const updateDocument = { $set: { "seats.$.isAvailable": false } };
    const updateFlightCollection = await db
      .collection("flights_collection")
      .updateOne(query, updateDocument);

    if (updateFlightCollection.acknowledged) {
      res.status(200).json({
        status: 200,
        data: newReservation,
        message: "The Reservation Is Done Successfully",
      });
    } else {
      res
        .status(404)
        .json({ status: 404, data: "The Reservation Is Not Completed" });
    }
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
};

// updates a specified reservation

const updateReservation = async (req, res) => {
  const { UpdateFSeat, updateFName, UpdateLName, UpdateEmail } = req.body;
  const { reservationId } = req.params;
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("slingair_project");
    const result = await db
      .collection("reservation_Data")
      .findOne({ _id: reservationId });

    if (UpdateFSeat) {
      const updateReservation = await db
        .collection("reservation_Data")
        .updateOne(
          { _id: reservationId },
          {
            $set: {
              seat: UpdateFSeat,
              givenName: updateFName,
              surname: UpdateLName,
              email: UpdateEmail,
            },
          }
        );

      const queryOld = { _id: result.flight, "seats.id": result.seat };
      const updateDocumentOld = { $set: { "seats.$.isAvailable": true } };
      const updateFlightCollectionOldSeat = await db
        .collection("flights_collection")
        .updateOne(queryOld, updateDocumentOld);

      const queryNew = { _id: result.flight, "seats.id": UpdateFSeat };
      const updateDocumentNew = { $set: { "seats.$.isAvailable": false } };
      const updateFlightCollectionNewSeat = await db
        .collection("flights_collection")
        .updateOne(queryNew, updateDocumentNew);

      if (
        updateReservation.acknowledged &&
        updateFlightCollectionOldSeat.acknowledged &&
        updateFlightCollectionNewSeat
      ) {
        res.status(200).json({
          status: 200,
          message: "The Reservation Is Updatad Successfully",
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "The Reservation Update Is Not Completed",
        });
      }
    }

    if (UpdateFSeat == undefined) {
      const updateReservation = await db
        .collection("reservation_Data")
        .updateOne(
          { _id: id },
          {
            $set: {
              givenName: updateFName,
              surname: UpdateLName,
              email: UpdateEmail,
            },
          }
        );
      if (updateReservation.acknowledged) {
        res.status(200).json({
          status: 200,
          message: "The Reservation Is Updatad Successfully",
        });
      } else {
        res.status(404).json({
          status: 404,
          data: "The Reservation Update Is Not Completed",
        });
      }
    }
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
};

// deletes a specified reservation
const deleteReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  const { reservation } = req.params;

  try {
    await client.connect();
    const db = client.db("slingair_project");

    const result = await db
      .collection("reservation_Data")
      .findOne({ _id: reservation });

    const query = { _id: result.flight, "seats.id": result.seat };
    const updateDocument = { $set: { "seats.$.isAvailable": true } };
    const updateFlightCollection = await db
      .collection("flights_collection")
      .updateOne(query, updateDocument);

    const deleteReservation = await db
      .collection("reservation_Data")
      .deleteOne({ _id: reservation });

    if (deleteReservation.acknowledged && updateFlightCollection.acknowledged) {
      res.status(200).json({
        status: 200,
        message: "The Reservation Is Deleted Successfully",
      });
    } else {
      res
        .status(404)
        .json({ status: 404, data: "The Operation Is Not Completed" });
    }
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservation,
  getSingleReservation,
  deleteReservation,
  updateReservation,
};
