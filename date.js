// Adding new module

//1.Get rid of function name - make anon function
//2.Store it in a variable
//3.Shorten these 2 lines so one thing equals another
//   module.exports.getDate = getDate;
//   var getDate = function() {
//4. Use arrow function


// no need to use module.exports
exports.getDate = () => {
    //change to const cause we dont change the values
  const today = new Date();

  const options = {
    day: "numeric",
    weekday: "long",
    month: "long"
  };
  return today.toLocaleDateString("en-US", options);
};

//export another function from module

exports.getDay = () => {
  const today = new Date();

  const options = {
    weekday: "long"
  };

  return today.toLocaleDateString("en-US", options);
};
