//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs"); //below the express one cause uses app

app.get("/", (req, res) => {
  var today = new Date();
  var currentDay = today.getDay();
  var day = "";

  switch (currentDay) {
    case 0:
        day = "Sunday";
      break;
      case 1:
        day = "Monday";
      break;
      case 2:
        day = "Tuesday";
      break;
      case 3:
        day = "Wedfday";
      break;
      case 4:
        day = "Thurday";
      break;
      case 5:
        day = "Friday";
      break;
      case 6:
        day = "Saturday";
      break;
  
    default:
      console.log("Error: current day is equal to " + currentDay
      );
      break;
  }
   //list.ejs has to be in views
  res.render("list", {kindOfDay: day}); //some ppl use same name as in ejs file but it's easier to differentiate
});

app.listen(3000, () => {
  console.log("Server started on port 3000.");
});
