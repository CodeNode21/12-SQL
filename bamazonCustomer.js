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
    connection.query("SELECT * FROM products", (err, res) => {
        if(err) throw err;
        console.table(res);
        // connection.end();
        retailTherapy();
    })
};

function retailTherapy(){
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
                productSelection();
                break;
            case "no":
                console.log("Alright, good bye...");
                connection.end
                break;
        }
      });
}

function productSelection(){
    connection.query("SELECT product_name, item_id FROM products", (err, res) => {
        if(err) throw (err);
        // console.log(err);
        console.table(res);
        inquirer
          .prompt([
              {
                  type: "input",
                  name: "choice",
                  message: "I'd like to purchase item number _",
                  validate: (val)=> {
                      return !isNaN(val);
                  }
              }
          ])
          .then((val)=>{
            let choiceId = parseInt(val.choice);
            let product = checkInventory(choiceId, inventory);
            if (product) {
                
            }
          })
    } )

}

function checkInventory(chioceId, inventory){
    connection.query("")
}


