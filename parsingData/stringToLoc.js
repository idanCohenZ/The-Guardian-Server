require("dotenv").config();
const axios = require("axios");

const getLocations = async (postsArray) => {
  const locations = [];
  for (let index = 0; index < postsArray.data.length; index++) {
    const location = await getLocationFromString(
      postsArray.data[index].caption
    );
    if (location && location.candidates && location.candidates.length > 0)
      locations.push({
        location: location.candidates[0].name,
        date: postsArray.data[index].timestamp.substring(0, 10),
      });
  }
  return locations;
};

const getLocationFromString = async (possible_location) => {
  const API_KEY = process.env.GOOGLE_API_KEY;
  // console.log(API_KEY);
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
  const response = await axios(config);
  return response.data;
};
// getLocationFromString("chilling in Clei Zemer Beer Sheva");
module.exports = { getLocations };
