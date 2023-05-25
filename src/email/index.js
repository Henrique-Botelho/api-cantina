const nodemailer = require("nodemailer");
const { USER_EMAIL, PASS_EMAIL } = require('../config/config');

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: USER_EMAIL,
    pass: PASS_EMAIL,
  },
});

module.exports = transport;