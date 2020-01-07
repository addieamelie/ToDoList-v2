//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js"); // ALWAYS REMEMBER ////// SLASH

const app = express();

//can use const cause we can push to the array but not assign new array

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.set("view engine", "ejs"); //below the express one cause uses app

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  const day = date.getDate(); //can change to date.getDay()
  //list.ejs has to be in views to use render
  res.render("list", { listTitle: day, newListItems: items }); //some ppl use same name as in ejs file but it's easier to differentiate
});

app.post("/", (req, res) => {
  const item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/"); //redirect to home route
  }
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});
app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000.");
});
