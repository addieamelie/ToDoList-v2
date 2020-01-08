//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js"); // ALWAYS REMEMBER ////// SLASH

const app = express();

//can use const cause we can push to the array but not assign new array

const items = ["Buy groceries", "Go to post office", "Pay bills"];
const workItems = [];

app.set("view engine", "ejs"); //below the express one cause uses app

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//create
const itemSchema = {
  name: String
};
//create mongoosemodel
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Do groceries"
});
const item2 = new Item({
  name: "Do laundry"
});
const item3 = new Item({
  name: "Watch news"
});
const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Inserted successfully");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItems: foundItems }); //some ppl use same name as in ejs file but it's easier to differentiate
    }
  });

  const day = date.getDate(); //can change to date.getDay()
  //list.ejs has to be in views to use render
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  item.save();
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/"); //redirect to home route
  }
});
app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, (err)=>{
    if(!err){
      console.log("Successfully removed.");
      res.redirect("/");
    }
  })
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
