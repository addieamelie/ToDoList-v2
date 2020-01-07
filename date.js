// Adding new module

//1.Get rid of function name - make anon function
//2.Store it in a variable
//3.Shorten these 2 lines so one thing equals another
//   module.exports.getDate = getDate;
//   var getDate = function() {
//4. Use arrow function

module.exports.getDate = () => {
  let today = new Date();

  var options = {
    day: "numeric",
    weekday: "long",
    month: "long"
  };
  return today.toLocaleDateString("en-US", options);
};

//export another function from module

module.exports.getDay = () => {
  let today = new Date();

  var options = {
    weekday: "long"
  };

  return today.toLocaleDateString("en-US", options);
};
console.log(module.exports);
