const mongoose = require("mongoose");
const Experience = require("../models/Experience");
const User = require("../models/User");
const Review = require("../models/Review");
const faker = require("faker");
const bcrypt = require("bcryptjs");
require("dotenv").config();
/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */

const fetch = require("node-fetch");
const UNSPLASH_ACCESSKEY = process.env.UNSPLASH_ACCESSKEY;

const fetchUnsplash = async () => {
    let url = `https://api.unsplash.com/photos/random?count=30&orientation=landscape`;
    let data = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESSKEY}` }
    });
    let response = await data.json();
    let urlArray = [];
    for (let i = 0; i < response.length; i++) {
        urlArray.push(response[i].urls.small);
    }
    return urlArray;
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const cleanData = async (startTime) => {
  try {
    await User.collection.drop();
    await Experience.collection.drop();
    await Review.collection.drop();
    // OR: await mongoose.connection.dropDatabase();
    console.log("| Deleted all data");
    console.log("-------------------------------------------");
  } catch (error) {
    console.log(error);
  }
};


const generateData = async () => {
  try {
    await cleanData();
    // airbnb.experiences
    let users = [];
    let experiences = [];
    let imageArray = await fetchUnsplash();
    console.log("| Create 10 users:");
    console.log("-------------------------------------------");
    const userNum = 10;
    const otherNum = 3; // num of blog each user, reviews or reactions each blog
    for (let i = 0; i < userNum; i++) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash("123", salt);
      await User.create({
        // name ne
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        avatarUrl: faker.image.avatar(),
        password,
        emailVerified: true,
      }).then(function (user) {
        console.log("Created new user: " + user.name);
        users.push(user);
      });
    }

    let languages = ["English", "Vietnamese"];
    let tags = ["Animals",
    "Arts & Writing",
    "Cooking",
    "Dance",
    "Drinks",
    "Entertainment",
    "Fitness",
    "History & Culture",
    "Magic",
    "Music",
    "Wellness"]

    console.log(`| Each user writes ${otherNum} blogs`);
    console.log("-------------------------------------------");
    let x = -1;
    for (let i = 0; i < userNum; i++) {
      for (let j = 0; j < otherNum; j++) {
        x++
        await Experience.create({
          author: users[i]._id,
          title: faker.lorem.words(3).toUpperCase(),
          pictureUrl: imageArray[x],
          city: faker.address.city(),
          country: faker.address.country(),
          description: faker.random.words(),
          minimumRate: Math.floor(Math.random() * 200),
          groupsize: Math.floor(Math.random() * 5) + 5,
          duration: Math.floor(Math.random() * 3) + 1,
          averageRating: Math.floor(Math.random() * 4) + 2,
          language: languages[Math.floor(Math.random() * languages.length)],
          tag: tags[Math.floor(Math.random() * tags.length)]
          
        }).then(async (exp) => {
          console.log("Created exp:" + exp.title);
          experiences.push(exp);

          console.log(
            `| Each exp has ${otherNum} reviews from ${otherNum} random users`
          );
          console.log("-------------------------------------------");
          for (let k = 0; k < otherNum; k++) {
            await Review.create({
              content: faker.lorem.sentence(),
              user: users[getRandomInt(0, userNum - 1)]._id,
              exp: exp._id,
              rating: Math.floor(Math.random() * 4) + 2
            });
          }

        });

      }
    }
    console.log("| Generate Data Done");
    console.log("-------------------------------------------");

    
  } catch (error) {
    console.log(error);
  }
};

const getRandomExp = async (ExpNum) => {
  console.log(`Get ${ExpNum} random blogs`);
  const totalExpNum = await Experience.countDocuments();
  for (let i = 0; i < ExpNum; ++i) {
    const exp = await Experience.findOne()
      .skip(getRandomInt(0, totalExpNum - 1))
      .populate("author");
    console.log(exp);
  }
};


const main = async (resetDB = false) => {
  if (resetDB) await generateData();
};

// remove true if you don't want to reset the DB
main(true);