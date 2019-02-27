const keys = require("./login.js");
const password = keys.mySQL.pass
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

//Reading row data of identified ID

function purchase() {
    inquirer.prompt({
        name: "product_id",
        type: "input",
        message: "What product ID?"
    }).then(function (responseUserIDAnswer) {
        connection.query("SELECT product_name FROM products WHERE ?", {
            item_id: responseUserIDAnswer.product_id
        }, function (err, responseToIdQuery) {
            if (err) throw err;
            inquirer.prompt({
                name: "amount",
                type: "input",
                message: "How much would you like?"
            }).then(function (resAmount) {
                connection.query("SELECT stock_quantity FROM products Where ?", {
                    item_id: responseUserIDAnswer.product_id
                }, function (err, responseToAmountQuery) {
                    if (err) throw err;
                    connection.end();
                    console.log("You selected " + responseToIdQuery[0].product_name)
                    console.log("We have "+ responseToAmountQuery[0].stock_quantity+ " in stock")
                    console.log("Amount requested " + resAmount.amount);
                
                })
            })
        });

    })
}
purchase();