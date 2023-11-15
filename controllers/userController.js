const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.user_form_get = (req, res, next) => {
  res.render("sign-up-form");
};

exports.user_form_post = asyncHandler(async (req, res, next) => {
  bcrypt.hash(
    req.body.password,
    10,
    asyncHandler(async (err, hashedPassword) => {
      const user = new User({
        username: req.body.username,
        fullname: req.body.fullname,
        password: hashedPassword,
      });
      const result = await user.save();
      res.redirect("/");
    })
  );
});
