require("dotenv").config()
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: process.env.host,
    port: process.env.PORT || 4000,
    user: process.env.user,
    password: process.env.db_password,
    database: process.env.database
});


connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    inventoryList();
});

function inventoryList(){
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", (err, res) => {
        if(err) throw err;
        console.table(res);
        // connection.end();
        shopping(res);
    })
};

function shopping(val){
    inquirer
      .prompt([
          {
              type: "input",
              name: "choice",
              message: "Here are all items for purchase. Would you like to buy a product?\n Type yes or no\n",
              choices: [
                  "yes",
                  "no"
              ]
          }
        ])
        .then(answer =>{
            switch (answer.choice){
            case "yes":
                console.log("Alright, choose desired product by id and enter it");
                productSelection(val);
                break;
            case "no":
                console.log("Alright, goodbye...");
                connection.end;
                process.exit(0)
                break;
            default:
                console.log("Please type yes or no");
                shopping();
        }
      });
}

function productSelection(inventory){
        inquirer
          .prompt([
              {
                  type: "input",
                  name: "choice",
                  message: "Please enter Id number of the item you'd like to purchase :",
                  validate: (val)=> {
                    //   console.log("\n"+val)
                      return !isNaN(val);
                  }
              }
          ])
          .then((val)=>{
            let productId = parseInt(val.choice);
            let product = checkInventory(productId, inventory);
                if (product) {
                    console.log(`You've selected ${product.product_name}.   
    This item costs \$${product.price} each and there are currently ${product.stock_quantity} in stock.`);
                    orderStart(product);
                }
                else{
                console.log("Product you've selected does not exist. Please try again.")
                productSelection();
                }
          })
};

function orderStart(product){
    inquirer
        .prompt([
            {
                type: "input",
                name: "quantity",
                message: "How many would you like? :",
                validate: function(val) {
                    return val >= 0;
                }
            }
        ])
        .then(function(val){
            var quantity = parseInt(val.quantity);
            if (quantity > product.stock_quantity){
                console.log(`There are only ${product.stock_quantity} and not enough to fulfill the order.. Please choose a lesser amount. `);
                orderStart(product);
            }
            else {
                checkout(product, quantity)
            }
        })
}

function checkout(product, quantity){
    connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
        [quantity, product.item_id],
        function(err, res) {
            console.log(`\nCongrats on completing your order of ${product.item_id} ${product.product_name} for total of \$` + product.price*quantity);
            inventoryList();
        }
    )
}

function checkInventory(productId, inventory){
    for (var i = 0; i < inventory.length; i++){
        if (inventory[i].item_id === productId) {
            return inventory[i];
        }
    }
    return null;
}


