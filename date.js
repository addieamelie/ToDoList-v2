// Adding new module

module.exports.getDate = getDate;

function getDate() {
  let today = new Date();

  var options = {
    day: "numeric",
    weekday: "long",
    month: "long"
  };

  let day = today.toLocaleDateString("en-US", options);
  return day;
}

//export another function from module
module.exports.getDay = getDay;

function getDay() {
    let today = new Date();
  
    var options = {
      weekday: "long"
    };
  
    let day = today.toLocaleDateString("en-US", options);
    return day;
  }
  console.log(module.exports);