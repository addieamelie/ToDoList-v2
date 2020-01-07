//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

var items = [];

app.set("view engine", "ejs"); //below the express one cause uses app

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) => {
  
  var today = new Date();
  
  var options = {
    weekday: "long", 
    day: "numeric",
    month: "long"
  };

  var day = today.toLocaleDateString("en-US", options);
   //list.ejs has to be in views
  res.render("list", {kindOfDay: day, newListItems: items}); //some ppl use same name as in ejs file but it's easier to differentiate
});

app.post("/", (req,res) => {
  var item = req.body.newItem;
  items.push(item);
  res.redirect("/"); //redirect to home route
});

app.listen(3000, () => {
  console.log("Server started on port 3000.");
});
