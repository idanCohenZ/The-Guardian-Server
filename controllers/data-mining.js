require("dotenv").config();
const mongoose = require("mongoose");
require("../db/db_connection");
require("../db/userModel");
const axios = require("axios");
const User = mongoose.model("user");
const { labelsFromImg } = require("../parsingData/labelsFromImg");
const { faceDetection } = require("../parsingData/face-detection");
const { getLocations } = require("../parsingData/stringToLoc");

const setUpInstagram = async (token) => {
  let code = token;
  let redirectUri = process.env.OAUTH_URI;
  let accessToken = null;
  let userId = null;
  try {
    // send form based request to Instagram API
    let result = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      {
        client_id: process.env.INSTA_APP_ID,
        client_secret: process.env.INSTA_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code: code,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Got access token.
    accessToken = result.data.access_token;
    userId = result.data.user_id;

    // get data from user account
    result = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`
    );
    const posts_data = result.data;
    if (!posts_data) return console.log("No valid data found ");
    try {
      const user = new User({ user_id: userId, data: posts_data });
      const saved_data = await user.save();
      // console.log(`User has been added to the database ${saved_data}`);
    } catch (error) {
      console.log(`error by creating new user ${error}`);
    }
  } catch (e) {
    console.log("Error=====", e);
  }
  return userId;
};

async function analyzeData(userId) {
  let postsData = await getDataFromDb(userId);
  let posts = postsData[0].data[0].data;

  // build json for user
  const postsAmount = posts.length;
  const facesData = await faceDetection(posts);
  const locationsData = await getLocations(posts);
  //can return an array of semantic categories as well
  const labelsData = await labelsFromImg(posts);

  const res = {};
  res.posts = postsAmount;
  res.relatives = facesData;
  res.locations = locationsData;
  res.labels = labelsData;

  // let json = JSON.stringify(obj);
  return res;
}

async function getDataFromDb(userId) {
  let postsData = User.find({ user_id: userId });
  return postsData;
}

module.exports = {
  setUpInstagram,
  analyzeData,
};
