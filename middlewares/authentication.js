const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { AppError } = require("../helpers/utils.helper");
const authMiddleware = {};

authMiddleware.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    console.log("Token ", tokenString);
    if (!tokenString)
      return next(new AppError(401, "Login required", "Validation Error"));
    const token = tokenString.replace("Bearer ", "");
    console.log("tokenString", tokenString)
    console.log("token",token)

    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(new AppError(401, "Token expired", "Validation Error"));
        } else {
          return next(
            new AppError(401, "Token is invalid", "Validation Error")
          );
        }
      }
      // console.log(payload);
      // we need this userId to find the user
      // next middleware we will need this req.userId
      req.userId = payload._id;
      console.log("req.userId ne: ", req.userId);
    });
    next();
  } catch (error) {
    next(error);
  }
};

// middleware isHost

module.exports = authMiddleware;