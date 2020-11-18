// 1.
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const utilsHelper = require("../helpers/utils.helper");
const emailHelper = require("../helpers/email.helper");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// 2.
const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String, require: false, default: "" },
    password: { type: String, required: true, select: false },
    emailVerificationCode: { type: String, select: false },
    emailVerified: { type: Boolean, require: true, default: false },
    isDeleted: { type: Boolean, default: false, select: false },
    isHost: { type: Boolean, default: false},

  },
  { timestamps: true },
  {toJSON: {virtuals: true}},
  {toObject: {virtuals: true}},
);

userSchema.plugin(require("./plugins/isDeletedFalse"));

// 4. the .methods are added later if needed
userSchema.methods.toJSON = function () {
  
  const obj = this._doc; 
  delete obj.password;
  delete obj.emailVerified;
  delete obj.emailVerificationCode;
  delete obj.isDeleted;
  return obj;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

// userSchema.pre("save", function (next) {
//   if (this.isNew) {
//     this.emailVerificationCode = utilsHelper.generateRandomHexString(15);
//     this.wasNew = true; 
//   }
//   next();
// });

// userSchema.post("save", function(next) {
//   if(this.wasNew) {
//     emailHelper.sendVerificationEmail(this);
//   }
//   next();
// })

// 3.
const User = mongoose.model("User", userSchema);
module.exports = User;