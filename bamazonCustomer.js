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
                    if (resAmount.amount > responseToAmountQuery[0].stock_quantity){
                        console.log("We don't have that amount in stock.")
                    }
                    else {
                        console.log("Your order of " + responseToIdQuery[0].product_name + "was successful.")
                        connection.query("SELECT price FROM products Where ?", {
                            item_id: responseUserIDAnswer.product_id
                        }, function (err, responseToPriceQuery) {
                        console.log("The cost of the item "+ responseToPriceQuery[0].price)
                        connection.end();    
                    })  
                    }
                    
                   
                   
                })
              
            })
            
        });

    })
}
purchase();