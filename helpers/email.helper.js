"use strict";
const emailHelper = {};
const FRONTEND_URL = process.env.FRONTEND_URL;
const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN});

emailHelper.sendTestEmail = () => {
  
  const data = {
    from:
      `Mailgun Sandbox <postmaster@${DOMAIN}>`,
    to: "duong.trade.td97@gmail.com",
    subject: "Hello",
    text: "Testing some Mailgun awesomeness!",
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);
  });
};

emailHelper.sendVerificationEmail = (user) => {
    const data = {
      from:
        `Mailgun Sandbox <postmaster@${MAILGUN_DOMAIN}>`,
      to: user.email,
      subject: "Please Verify Your Email Address",
      template: "verify_email",
      "v:verification_link": `${process.env.FRONTEND_URL}verify?token=${user.emailVerificationCode}`,
      "v:name": user.name
    };
    mg.messages().send(data, function (error, body) {
      console.log(body);
    });
  };

module.exports = emailHelper;