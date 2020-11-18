var express = require('express');
var router = express.Router();
var emailHelper = require("../helpers/email.helper");

// authApi
const authApi = require("./auth");
router.use("/auth", authApi);

/* GET home page. */
// expApi
const expApi = require("./exp");
router.use("/exp", expApi);

// userApi
const userApi = require("./users");
router.use("/users", userApi);

// reviewApi
const reviewApi = require("./review");
router.use("/reviews", reviewApi);

/* Temporary GET route to send  an email. */
router.get("/test-email", (req, res) => {
  emailHelper.sendTestEmail();
  res.send("email sent");
});

module.exports = router;
