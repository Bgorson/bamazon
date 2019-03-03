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

function start() {
    // prompts user to enter the ID
    inquirer.prompt({
        name: "managerOptions",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }).then(function (response) {
//switch statement based on list selection
        switch (response.managerOptions) {
            case "View Products":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            case "Exit":
                console.log("Good-Bye");
                break;
        }
    })
}

function viewProducts() {
// views all products and shows information
    connection.query("SELECT * FROM products",
        function (err, response) {
            if (err) throw err;
            console.log("Current Inventory")
            console.log("\n Item ID  | Product    |Price  |Stock")
            for (i = 0; i < response.length; i++) {
                console.log("\n" + response[i].item_id + "           " + response[i].product_name + "      " + response[i].price.toFixed(2) + "     " + response[i].stock_quantity)
            }
        })
    connection.end();
}

function viewLowInventory() {
    //identifies and shows only items with less than 5 items 
    connection.query("SELECT * FROM products WHERE stock_quantity < 5 ",
        function (err, response) {
            if (err) throw err;
            console.log("Current Low Stock")
            console.log("\n Item ID  | Product    |Price  |Stock")
            for (i = 0; i < response.length; i++) {
                console.log("\n" + response[i].item_id + "           " + response[i].product_name + "      " + response[i].price.toFixed(2) + "     " + response[i].stock_quantity)
            }
        })
    connection.end();
}

function addToInventory() {
    let currentProductsArray = [];
    //creates an array of possible products to choose from
    connection.query("SELECT * FROM products",
        function (err, allItemsQuery) {
            for (i = 0; i < allItemsQuery.length; i++) {
                (currentProductsArray.push(allItemsQuery[i].product_name))
            }
            inquirer.prompt(
                [{
                name: "updateSelection",
                type: "list",
                message: "Which product's stock would you like to increase?",
                choices: currentProductsArray
            },
            {
            name:"amount",
            type: "input",
            message: "How much would you like to increase it by?",
            }
        ]).then(function (selectedItem) {
                let amountSelected = selectedItem.amount
                let indexOfItem = currentProductsArray.indexOf(selectedItem.updateSelection)
                connection.query(
                    "UPDATE products SET stock_quantity= stock_quantity + "+ amountSelected +" WHERE product_name= '"+ allItemsQuery[indexOfItem].product_name+ "'",
                    function (err, res) {
                        console.log("Added " + amountSelected + " " + allItemsQuery[indexOfItem].product_name)
                })
                connection.end();
            })
        })
}


function addNewProduct() {
    //prompts user to submit relevant information and creates a response from it
    console.log("Add your new product's information here")
    inquirer.prompt([{
            name: "product",
            type: "input",
            message: "What is the name of your product?"
        },
        {
            name: "department",
            type: "input",
            message: "What department does your product belong in?"
        },
        {
            name: "price",
            type: "input",
            message: "How much does your product cost?"
        },
        {
            name: "stock",
            type: "input",
            message: "How much do we have?"
        },

    ]).then(function (newProductRes) {
        //query to add the entered information into MYSQL db
        console.log("New product added")
        connection.query(
            "INSERT INTO products SET ?", {
                product_name: newProductRes.product,
                department_name: newProductRes.department,
                price: newProductRes.price,
                stock_quantity: newProductRes.stock,
                product_sales:0
            }
        )
        connection.end();
    })

}
start();