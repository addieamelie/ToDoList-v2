const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

const day = date.getDate();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { //to connect to MongoDB Atlas change to your own url
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
//Create schema for list items
const itemSchema = {
  name: String
};
//Create mongoose model
const Item = mongoose.model("Item", itemSchema);

//Create array of default items
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

//Create schema for custom lists eg work
const listSchema = {
  name: String,
  items: [itemSchema]
};
//Create mongoose model
const List = mongoose.model("List", listSchema);

//Generate about page before :customListName to avoid generating about list in db
app.get("/about", (req, res) => {
  res.render("about");
});

//Prevent generating "favicon.ico" list
app.get("/favicon.ico", function(req, res) {
  res.sendStatus(204);
});

//Generate home page with items or default items if db empty
app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, err => {
        if (err) {
          console.log(err);
        } else {
          console.log("Inserted successfully");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItems: foundItems });
    }
  });
});

app.post("/", (req, res) => {
  const listName = req.body.list; //Name of button
  const itemName = req.body.newItem; //Name of item input

  //Create new item in collection
  const item = new Item({
    name: itemName
  });

  //Add new item to home list or custom list eg work
  if (listName === day) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

//Delete item from home list or custom list eg work
app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName; //Name of hidden input in list.js

  if (listName === day) {
    Item.findByIdAndRemove(checkedItemId, err => {
      if (!err) {
        console.log("Successfully removed.");
        res.redirect("/");
      }
    });
  } else {
    console.log(listName, checkedItemId);
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      (err, foundList) => {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

//Show and/or generate custom lists and add them to list collction in db
app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName); //use lodash to capitalize list name

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000.");
});
