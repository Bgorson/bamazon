const keys = require("./login.js");
const password = keys.mySQL.pass
const inquirer = require("inquirer")
const mysql = require("mysql");
// Creates connection to MYSQL Database uses .env for password
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

function purchase() {
    // prompts user to enter the ID
    inquirer.prompt({
        name: "product_id",
        type: "input",
        message: "What product ID?"
    }).then(function (responseUserIDAnswer) {
        // after ID is selected, query is ran to get that ID's product name
        connection.query("SELECT product_name FROM products WHERE ?", {
            item_id: responseUserIDAnswer.product_id
        }, function (err, responseToIdQuery) {
            if (err) throw err;
            inquirer.prompt({
                // user is then asked to select the amount
                name: "amount",
                type: "input",
                message: "How much would you like?"
            }).then(function (resAmount) {
                // app checks to see how much of the item selected earlier is actually in stock
                connection.query("SELECT stock_quantity FROM products Where ?", {
                    item_id: responseUserIDAnswer.product_id
                }, function (err, responseToAmountQuery) {
                    if (err) throw err;
                    // If there isn't enough, a console log is sent
                    if (resAmount.amount > responseToAmountQuery[0].stock_quantity) {
                        console.log("\n \n*********We don't have that amount in stock.*************\n")
                        displayInventory();
                    } else {
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [{
                                    stock_quantity: responseToAmountQuery[0].stock_quantity - resAmount.amount
                                },
                                {
                                    product_name: responseToIdQuery[0].product_name
                                }
                            ],
                            function (err, res) {
                                console.log("Order placed!\n");
                            })

                        // If there is enough, a message is sent confirming the order, showing the price and updating the database with the withdrawn product
                        connection.query("SELECT price FROM products Where ?", {
                            item_id: responseUserIDAnswer.product_id
                        }, function (err, responseToPriceQuery) {
                            console.log("The cost of the purchase is $" + (parseFloat(responseToPriceQuery[0].price) * resAmount.amount))
                            connection.end();
                        })
                    }
                })

            })

        });

    })
}

function displayInventory() {
    //all items are shown and formated
    connection.query("SELECT * FROM products",
        function (err, response) {
            if (err) throw err;
            console.log("Current Inventory")
            console.log("\n Item ID  | Product    |Price  |Stock")
            for (i = 0; i < response.length; i++) {
                console.log("\n" + response[i].item_id + "           " + response[i].product_name + "      " + response[i].price.toFixed(2) + "     " + response[i].stock_quantity)
            }
            purchase();
        })

}

displayInventory();