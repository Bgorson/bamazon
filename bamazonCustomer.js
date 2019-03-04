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
    // prompts user to enter the ID and amount
    inquirer.prompt([{
            name: "product_id",
            type: "input",
            message: "What product ID?"
        },
        {
            name: "amount",
            type: "input",
            message: "How much would you like?"
        }
    ]).then(function (response) {
    checkForStock(response.amount,response.product_id )
    })
}

function checkForStock(amount,id){
    connection.query("SELECT stock_quantity FROM products Where ?", {
        item_id: id
    }, function (err, responseToAmountQuery) {
        if (err) throw err;
        // If there isn't enough, a console log is sent
        if (amount > responseToAmountQuery[0].stock_quantity) {
            console.log("\n \n*********We don't have that amount in stock.*************\n")
            displayInventory();
        } else {
            updateStock(amount,id,responseToAmountQuery[0].stock_quantity)
        }
})
}

function updateStock(amount,id,amountAvailable){
    connection.query(
        //update the stock
        "UPDATE products SET ? WHERE ?",
        [{
                stock_quantity: amountAvailable - amount
            },
            {
                item_id: id
            }
        ],
        function (err, res) {
            console.log("Order placed!\n");
        })
        determingProfits(id,amount)
}

function determingProfits(id,amount){
    var totalCost;
    connection.query("SELECT price FROM products Where ?", {
        item_id: id
    }, function (err, responseToPriceQuery) {
        totalCost = (parseFloat(responseToPriceQuery[0].price) * amount)
        addProfitsToItem(id,totalCost)
    })
    
}

function addProfitsToItem(id,profit){
    connection.query(
        //update the stock
        "UPDATE products SET product_sales=product_sales +" + profit + " WHERE item_id="+id,
        function (err, res) {
           
        }) 
        Dept(id,profit)      
}

function Dept(id,profit){
        connection.query("SELECT department_name FROM products Where ?", {
            item_id: id
        }, function (err, responseToDeptQuery) {
        connection.query(
            "UPDATE departments SET product_sales=product_sales +" + profit + " WHERE department_name= '"+ responseToDeptQuery[0].department_name+"'",
            function (err, res) {
                console.log("This purchase cost $"+ profit)
            })       
            connection.end();
        }
    )
   
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