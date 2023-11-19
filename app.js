const express = require("express");
const bcrypt = require("bcryptjs");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

require("dotenv").config();
const mongoDB = process.env.SECRET_KEY;
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
const User = require("./models/users");
const Message = require("./models/messages");

const app = express();

const indexRouter = require("./routes/index");

app.set("views", "views");
app.set("view engine", "ejs");

app.use("/", indexRouter);

app.listen(3000, () => {
  console.log("listening on port 3000!");
});
