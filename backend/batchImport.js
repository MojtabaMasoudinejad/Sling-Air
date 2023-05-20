const { flights, reservations } = require("./data");

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const flightsCollection = [
  {
    _id: "SA231",
    flight: "SA231",
    seats: flights.SA231,
  },
  {
    _id: "FD489",
    flight: "FD489",
    seats: flights.FD489,
  },
];

let reservationData = [];

reservations.forEach((item) => {
  reservationData.push({
    _id: item._id,
    flight: item.flight,
    seat: item.seat,
    givenName: item.givenName,
    surname: item.surname,
    email: item.email,
  });
});

const batchImport = async () => {
  const client = new MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("slingair_project");

  await db.collection("flights_collection").insertMany(flightsCollection);
  await db.collection("reservation_Data").insertMany(reservationData);

  client.close();
};

batchImport();
