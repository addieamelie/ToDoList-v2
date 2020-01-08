//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js"); // ALWAYS REMEMBER ////// SLASH

const app = express();

//can use const cause we can push to the array but not assign new array
const day = date.getDate(); //can change to date.getDay()

app.set("view engine", "ejs"); //below the express one cause uses app

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
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

const listSchema = {
  name: String,
  items: [itemSchema]
};
const List = mongoose.model("List", listSchema);

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/favicon.ico", function(req, res) {
  res.sendStatus(204);
});

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
      res.render("list", { listTitle: day, newListItems: foundItems }); //some ppl use same name as in ejs file but it's easier to differentiate
    }
  });

  //list.ejs has to be in views to use render
});

app.post("/", (req, res) => {
  const listName = req.body.list; //name of button
  const itemName = req.body.newItem; //name of input

  const item = new Item({
    name: itemName
  });

  if (listName === day) {
    //workItems.push(item);
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName); //redirect to home route
    });
  }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if ((listName === day)) {
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


app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;

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
