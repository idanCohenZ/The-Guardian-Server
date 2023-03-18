let axios = require("axios");

function getLocationFromString(possible_location) {
  const API_KEY = "AIzaSyDi2ANBgT4eWZ - BJh_pe9b5jsA4zPu0EY4";
  const url =
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
    possible_location +
    "&inputtype=textquery&language=en&fields=name&key=" +
    API_KEY;

  let config = {
    method: "get",
    url: `${url}`,
    headers: {},
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}

module.exports = { getLocationFromString };
