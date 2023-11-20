const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const asyncHandler = require("express-async-handler");
const User = require("../models/users");
const Message = require("../models/messages");

const message_controller = require("../controllers/messageController");
const user_controller = require("../controllers/userController");

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

require("dotenv").config();
router.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
router.use(passport.initialize());
router.use(passport.session());
router.use(express.urlencoded({ extended: false }));

router.get("/", user_controller.index);

router.get("/sign-up", user_controller.user_form_get);

router.post("/sign-up", user_controller.user_form_post);

router.post("/", user_controller.user_login_post);

router.get("/log-out", user_controller.user_logout);

router.get("/member-form", user_controller.member_form_get);

router.post("/member-form", user_controller.member_form_post);

router.get("/message-form", message_controller.message_form_get);

router.post("/message-form", message_controller.message_form_post);

router.post("/delete-message/:id", async (req, res) => {
  const messageId = req.params.id;
  try {
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).send("Message not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("error deleting message");
  }
});

module.exports = router;
