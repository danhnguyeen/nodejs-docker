const express = require("express");
// log requests
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// mongoose.connect(
//   `mongodb+srv://danhnguyen:${process.env.MONGO_ATLAS_PW}@cluster0.ax4mq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
// );
const dbHost = process.env.DB_HOST || 'localhost'
const dbPort = process.env.DB_PORT || 27017
const dbName = process.env.DB_NAME || 'my_db_name'
const dbUser = process.env.DB_USER
const dbUserPassword = process.env.DB_PASSWORD
const mongoUrl = `mongodb://${dbUser}:${dbUserPassword}@${dbHost}:${dbPort}/${dbName}`

const connectWithRetry = function () { // when using with docker, at the time we up containers. Mongodb take few seconds to starting, during that time NodeJS server will try to connect MongoDB until success.
  return mongoose.connect(mongoUrl, { useNewUrlParser: true }, (err) => {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err)
      setTimeout(connectWithRetry, 5000)
    }
  })
}
connectWithRetry()

const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const app = express();

app.use(morgan("dev"));
// extended = true, can convert rich data on body, false is only convert simple data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Fix CORS request
app.use((req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  req.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use("/", function(req, res, next) {
  res.json({
    success: true,
    message: "Hello world 111"
  })
})

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
