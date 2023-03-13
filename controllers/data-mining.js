require("dotenv").config();
const mongoose = require("mongoose");
require("../db/db_connection");
require("../db/userModel");
const axios = require("axios");
const User = mongoose.model("user");

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
    // console.log(accessToken);
    // console.log(result.data);

    // get data from user account
    result = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`
    );
    // console.log(result.data);
    const posts_data = result.data;
    if (!posts_data) return console.log("No valid data found ");
    try {
      const user = new User({ user_id: userId, data: posts_data });
      const saved_data = await user.save();
      console.log(`User has been added to the database ${saved_data}`);
    } catch (error) {
      console.log(`error by creating new user ${error}`);
    }
  } catch (e) {
    console.log("Error=====", e);
  }
  return userId;
};

module.exports = {
  setUpInstagram,
};
