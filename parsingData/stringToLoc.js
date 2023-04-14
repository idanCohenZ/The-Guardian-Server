require("dotenv").config();
const axios = require("axios");

const getLocations = (postsArray) => {
  const locations = [];
  for (let index = 0; index < postsArray.data.length; index++) {
    const location = getLocationFromString(postsArray.data[index].caption);
    locations.push(location);
  }
};

const getLocationFromString = (possible_location) => {
  const API_KEY = process.env.GOOGLE_API_KEY;
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
};
// getLocationFromString("chilling in Clei Zemer Beer Sheva");
module.exports = { getLocations };
