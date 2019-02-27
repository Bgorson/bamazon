var keys = require("./login.js");
var password =keys.mySQL.pass

const inquirer = require("inquirer")
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: password,
  database: "bamazon_DB"
});
