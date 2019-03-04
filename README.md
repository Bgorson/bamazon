# bamazon

## Bamazon is a node application that demonstrates basic storefront operations. This app breaks down three user operations that interact with a mySQL database. 

```node bamazonCustomer.js``` 

Users will see the list of possible items for 'purchase'. Users can select the item that they wish to purchase and the amount. Users are informed of the total cost of this purchase and related information is also updated in the database such as total sales in the department, stock of the item in the store and total sales for that specific product.

```node bamazonManager.js``` 

Users can choose to see all available products, view products with less than 5 remaining items in stock, add a specific amount of items to an item in the store or add a new product. The database will be updated based on the users selection. 

```node bamazonSupervisor.js``` 

Users can choose to view the department sales for products that have the same 'department' indicated and also add a new department. "Overhead costs" are added which are taken into consideration when viewing the total profit of a department.

This app is built using javascript, mySQL, inquirer and my-tables. SQL database structure examples are included. 

View the following video to see the application in action: 

https://drive.google.com/file/d/1IUWNpytEV8HSdPdfVsxFq77tg6aeD84w/view
