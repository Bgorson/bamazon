const keys = require("./login.js");
const password = keys.mySQL.pass
const inquirer = require("inquirer")
const mysql = require("mysql");
var Table = require('easy-table')

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
        name: "supervisorChoice",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department", "Exit"]
    }).then(function (response) {
        if (response.supervisorChoice == "View Product Sales by Department"){
            viewProductSales();
        }
        if (response.supervisorChoice == "Create New Department"){
            createNewDepartment();
        }
        if (response.supervisorChoice == "Exit"){
            return false;
        }
    })
}


function viewProductSales() {
    
    let data=[];
    
    connection.query("SELECT * FROM departments",
    function(err,response){
           for (i=0;i <response.length;i++){ 
            let deptSales = response[i].product_sales- response[i].over_head_costs
           data.push(
                {
                    Department_ID:response[i].department_id,
                    Department_Name:response[i].department_name,
                    Over_Head_Costs: response[i].over_head_costs,
                    Product_Sales: response[i].product_sales,
                    Total_Profit: deptSales
                }
            )      
        }
        connection.end();
        var t = new Table
        data.forEach(function(product) {
            t.cell('Department ID', product.Department_ID)
            t.cell('Department Name', product.Department_Name)
            t.cell('Over Head Costs', product.Over_Head_Costs, Table.number(2))
            t.cell('Product_Sales', product.Product_Sales, Table.number(2))
            t.cell('Total Profit', product.Total_Profit, Table.number(2))
            t.newRow()
          })
           
          console.log(t.toString())
    })
}

function createNewDepartment() {
    inquirer.prompt([
        {
        name: "name",
        type: "input",
        message: "What is the name of the department?",
    },
    {
        name: "cost",
        type: "input",
        message: "What is the over head cost?",
    }
]).then(function (response) {
    connection.query(
    "INSERT INTO departments (department_name, over_head_costs,product_sales) VALUES ('"+ response.name+ "',"+ response.cost+",0);"
    )
    console.log("Added Department")
connection.end();
})

   
}



start();

