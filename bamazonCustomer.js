var mysql = require("mysql");
var inquire = require("inquirer");
var Table = require('cli-table2');
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'bamazon'
});

function customer() {
  console.log("Welcome to Bamazon!");
  var items = [{
    type: 'confirm',
    name: 'items',
    message: 'Would you like to shop? ',
    default: true
  }];
  inquire.prompt(items).then(function(user) {
    if (user.items) {
      displayItems();
    } else {
      console.log("Thank you for stopping by!");
      // connection.end();
      return;
    }
  });
}

function displayItems() {
  connection.query("SELECT * from products",
    function(err, res) {
      if (err) throw err;
      //console.log(res);
      for (var i = 0; i < res.length; i++) {
        var table = new Table({
          head: ['Item ID:', res[i].item_id],
          colWidths: [20, 20]
        });
        table.push(
          ['Item Name:', res[i].product_name], ['Price:', "$" + res[i].price], ['Left In Stock:', res[i].stock_quantity]
        );
        console.log(table.toString());
      }
      selectItem();
    }
  );
}

function selectItem() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    var selectItem = [{
        type: 'text',
        name: 'itemID',
        message: 'Enter item ID: ',
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        type: 'text',
        name: 'quantity',
        message: 'Enter the quantity: ',
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ];
    inquire.prompt(selectItem).then(function(user) {
      var itemSelected;
      var itemsAvailable = [];
      for (var i = 0; i < res.length; i++) {
        itemsAvailable.push(res[i].item_id);
        if (res[i].item_id === parseInt(user.itemID)) {
          itemSelected = res[i];
        }
      }
      if (itemsAvailable.indexOf(parseInt(user.itemID)) === -1) {
        invalidItemNumber(itemSelected, user);
      } else if (itemSelected.stock_quantity < user.quantity) {
        outOfStock(itemSelected, user);
      } else if (itemsAvailable.indexOf(parseInt(user.itemID)) > -1 && itemSelected.stock_quantity >= user.quantity) {
        completeOrder(itemSelected, user);
      }
    });
  });
}

function outOfStock(itemSelected, user){
  console.log("Sorry, we have " + itemSelected.stock_quantity + " left on stock right now.");
  console.log("Select a different amount or choose another item.");
  selectItem();
}
function invalidItemNumber(itemSelected, user){

  var invalidItemNumberError =
    "Item number " + user.itemNumber + " does not exist." + "\r\n" +
    "Enter valid item number." + "\r\n";
  console.log(invalidItemNumberError);
  selectItem();
}
function completeOrder(itemSelected, user) {
  var customerQuantity = user.quantity;
  var updatedStock = itemSelected.stock_quantity - customerQuantity;
  var customerTotal = itemSelected.price * customerQuantity;
  var salesTotal = itemSelected.product_sales + customerTotal;

  var table = new Table({
    head: ['Order details:', 'Item ID: ' + itemSelected.item_id],
    colWidths: [20, 20]
  });
  table.push(
    ['Product: ', itemSelected.product_name], ['Quantity:', customerQuantity], ['Total: ', customerTotal.toFixed(2)]
  );
  console.log(table.toString());
  var confirmOrder = [{
    type: 'confirm',
    name: 'confirmOrder',
    message: "Confirm Purchase? YES(Y) or NO(N).",
    default: true
  }];
  inquire.prompt(confirmOrder).then(function(user) {
    if (user.confirmOrder) {
      var query = connection.query(
        "UPDATE products SET ? WHERE ?", [{
            stock_quantity: updatedStock,
            product_sales: salesTotal
          },
          {
            item_id: itemSelected.item_id
          }
        ],
        function(err, res) {}
      )
      var table = new Table({
        head: ['Order complete: ', 'Item ID: ' + itemSelected.item_id],
        colWidths: [20, 20]
      });
      table.push(
        ['Item ordered: ', itemSelected.product_name], ['Quantity:', customerQuantity], ['Total Charged: ', customerTotal.toFixed(2)]
      );
       console.log(table.toString());
      continueShopping();
    } else {
      console.log("Order cancelled.");
      continueShopping();
    }
  })
}
function continueShopping() {
  var continueShopping = [{
    type: 'confirm',
    name: 'continueShopping',
    message: 'Would you like to continue shopping? ',
    default: true
  }];
  inquire.prompt(continueShopping).then(function(user) {
    if (user.continueShopping) {
      displayItems();
    } else {
      console.log("Thank you for shopping at Bamazon!");
      connection.end();
      return;
    }
  });
}
customer();
