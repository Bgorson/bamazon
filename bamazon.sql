DROP DATABASE IF EXISTS bamazon_DB;
CREATE database bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("apples", 'produce', 1,24);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("shirts", 'clothing', 5.25,10);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("laptop", 'electronics', 200,3);



SELECT * FROM products;
