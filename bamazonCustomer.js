require("dotenv").config()
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT || 4000,
    user: "root",
    password: process.env.db_password,
    database: "bamazon"
});


connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // stockinfo();
    retailTherapy();
});

function retailTherapy(){
    inquirer
      .prompt([
          {
              type: "input",
              name: "choice",
              message: "Above are all items for purchase. Would you like to buy a product?",
              chioces:
          }
      ])
      .then(function(val) {
        switch (answers.input)
      });
}

function stockinfo(){
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;
        console.log(res);
        connection.end();
    })
};

