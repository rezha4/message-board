const Message = require("../models/messages");

exports.message_form_get = (req, res, next) => {
  res.render("message-form");
};

exports.message_form_post = async (req, res, next) => {
  const message = new Message({
    message: req.body.message,
    author: req.user,
  });
  await message.save();
  res.redirect("/")
};
