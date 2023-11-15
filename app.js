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

passport.use(
  new LocalStrategy(
    asyncHandler(async (username, password, done) => {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    })
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(
  asyncHandler(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  })
);

app.use(session({ secret: "cnc", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

const indexRouter = require("./routes/index");

app.set("views", "views");
app.set("view engine", "ejs");

app.use("/", indexRouter);

app.listen(3000, () => {
  console.log("listening on port 3000!");
});
