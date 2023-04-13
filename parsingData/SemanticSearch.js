function semanticCategoryCreation(label) {
  // i haven't subscribed to the api in rapid api but it would work if i do
  //try and consoling the different parts - i believe the body is what we will need

  const axios = require("axios");

  const options = {
    method: "GET",
    url: `https://wordsapiv1.p.rapidapi.com/words/${label}/typeOf`,
    headers: {
      "X-RapidAPI-Key": "cddcfc5984msh4f6a815e3a56676p11a5f9jsn74d8dd7636af",
      "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
}
module.exports = semanticCategoryCreation;
