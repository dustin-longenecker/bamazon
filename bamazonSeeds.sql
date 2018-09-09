DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT(15) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(150) NOT NULL,
	department_name VARCHAR(150) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(15) NOT NULL,
  product_sales INT(15) NOT NULL,
	PRIMARY KEY (item_id)
);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Cell Phone", "Electronics", 399.95, 100, 0),
("Macbook", "Computers", 1499.95, 100, 0),
("Laptop", "Computers", 1199.89, 150, 0),
("Headphones", "Electronics", 49.99, 50, 0),
("Earbuds", "Electronics", 39.99, 25, 0),
("Television", "Entertainment", 299.99, 100, 0),
("Desktop", "Computers", 1599.99, 50, 0),
("Xbox", "Entertainment", 299.95, 75, 0),
("Speakers", "Entertainment", 69.99, 75, 0),
("MP3 Player", "Electronics", 59.00, 35, 0);
