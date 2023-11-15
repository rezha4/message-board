const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const message_controller = require("../controllers/messageController");
const user_controller = require("../controllers/userController");

router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.get("/sign-up", user_controller.user_form_get);

router.post("/sign-up", user_controller.user_form_post);

module.exports = router;
