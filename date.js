// Adding new module

module.exports = getDate;

function getDate() {
  let today = new Date();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  let day = today.toLocaleDateString("en-US", options);
  return day;
}
