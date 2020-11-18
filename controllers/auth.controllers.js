const {
    AppError,
    catchAsync,
    sendResponse,
  } = require("../helpers/utils.helper");
  const User = require("../models/User");
  const bcrypt = require("bcryptjs");
  const authController = {};
  
  authController.loginWithEmail = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // create an instance user of class User
    const user = await User.findOne({ email }, "+password");
    if (!user)
      return next(new AppError(400, "Invalid credentials", "Login Error"));
  // after had user, compare raw password and hash password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new AppError(400, "Wrong password", "Login Error"));
  // when user successfully logined, generate a token to send back to their browser
  // here we create a token for the instance user
    accessToken = await user.generateToken();
    // console.log("res be ne: ", res);
    return sendResponse(
      res,
      200,
      true,
      // cuz we need to send back the token to the browser
      { user, accessToken },
      null,
      "Login successful"
    );
  });

module.exports = authController;
  