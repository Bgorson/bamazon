console.log('this is loaded');
require("dotenv").config();
exports.mySQL = {
  pass: process.env.PW,
};