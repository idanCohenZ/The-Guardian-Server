const axios = require("axios");
require("dotenv").config();

const setUpInstagram = async (token) => {
  let code = token;
  let redirectUri = process.env.OAUTH_URI;

  let accessToken = null;
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

    // console.log(accessToken);
    // console.log(userId);

    // get data from user account
    result = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`
    );
    console.log(result.data);
  } catch (e) {
    console.log("Error=====", e);
  }
  return accessToken;
};

module.exports = {
  setUpInstagram,
};
