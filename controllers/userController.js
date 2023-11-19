const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.user_form_get = (req, res, next) => {
  res.render("sign-up-form", { errors: [] });
};

exports.user_form_post = [
  body("username", "Username cannot be empty")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username should be longer than 3 characters")
    .escape()
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error("Username taken");
      }
    }),
  body("password", "Password cannot be empty")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Minimum password length: 6 characters")
    .escape(),
  body("passwordConfirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password doesn't match");
    }
    return true;
  }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    bcrypt.hash(
      req.body.password,
      10,
      asyncHandler(async (err, hashedPassword) => {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        if (!errors.isEmpty()) {
          res.render("sign-up-form", {
            errors: errors.array(),
          });
          return;
        } else {
          await user.save();
          res.redirect("/");
        }
      })
    );
  }),
];

exports.user_login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

exports.user_logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.member_form_get = (req, res, next) => {
  res.render("member-form");
};

exports.member_form_post = async (req, res, next) => {
  if (req.body.code === "code") {
    try {
      req.user.isMember = true;
      await req.user.save();
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  }
};
