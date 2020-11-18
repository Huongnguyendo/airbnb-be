var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors")
const mongoose = require("mongoose");
require("dotenv").config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var expRouter = require('./routes/exp');
var authRouter = require('./routes/auth');

var app = express();

mongoose.connect("mongodb://localhost:27017/airbnb", { useNewUrlParser: true })


const db = mongoose.connection
db.once("open", function () {
    console.log("MongoDB database connection established successfully!");
    // require("./testing/testSchema");
});


app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/exp', expRouter);
app.use('/users', usersRouter);

app.use("/auth", authRouter);
// app.use("/experiences/:expID", reviewRouter);

module.exports = app;
