//new version - my version 20.07.23
let natural = require("natural");
const fs = require("fs");

async function semanticCategoryCreationForArray(labelArrayObjects) {
  let categoryResult;
  let Wordsclassifier = new natural.BayesClassifier();

  let category_array = [];
  for (let index = 0; index < labelArrayObjects.length; index++) {
    const element = labelArrayObjects[index];
    categoryResult = await semanticCategoryCreation(
      element.string,
      Wordsclassifier
    );
    console.log(
      "The category for: " + element.string + " is :" + categoryResult
    );

    if (categoryResult && !category_array.includes(categoryResult)) {
      category_array.push(categoryResult);
    }
  }

  console.log(
    "finished semanticCategoryCreationForArray, the array of categories is: " +
      category_array
  );
  return category_array;
}

async function semanticCategoryCreation(label, Wordsclassifier) {
  await trainClassifier(Wordsclassifier);
  return Wordsclassifier.classify(label);
}

async function trainClassifier(Wordsclassifier) {
  Wordsclassifier.addDocument(
    "Smile Light Happy Leisure Fun Cool Event ",
    "General"
  );
  Wordsclassifier.addDocument(
    "Hairstyle Bracelet Fashion accessory Cap Hat Body jewelry Jewellery Earrings making Sleeve Blazer T-shirt" +
      "Shoe Sneakers Jeans Trousers Shorts Textile",
    "A Fashion Enthusiast "
  );
  Wordsclassifier.addDocument(
    " Field archery Arrow Target Elbow ",
    "An Archer"
  );
  Wordsclassifier.addDocument(
    " Road Mountain Path Boots Wood Bird Lake Tints and shades Branch Natural Twig landscape Asphalt Travel Terrestrial plant Tree Botany Grass Sunlight Lake Tints and shades Branch Natural Twig Grass Plant Flower Houseplant Flowerpot Cloud ",
    " Hiking and Travelling"
  );

  Wordsclassifier.addDocument(" Font Words Typography Document", "Writing");

  Wordsclassifier.addDocument(" Cigarette Smoke    ", "Smoker");

  Wordsclassifier.addDocument(
    "   Goggles Sunglasses  Vision care eye  ",
    "Glasses- wearer"
  );
  Wordsclassifier.addDocument(
    " Music guitar drums band flute trumpet Artist Musician Musical instrument Concert Microphone Guitarist String instrument   ",
    "Music Lover"
  );
  Wordsclassifier.addDocument(
    " Military camouflage uniform Marines Cargo pants Soldier Army Squad    ",
    "Extolling Army Service"
  );
  Wordsclassifier.addDocument(
    " Horse dog cat cow bird crow breed Whiskers Companion Snout Pet Retriever Carnivore   ",
    "Animal Lover"
  );

  await Wordsclassifier.train();
}
module.exports = semanticCategoryCreationForArray;

//--------------------------------------------------
//The previous model - The one was saved on Roi's version:
// let natural = require("natural");
// const fs = require("fs");

// function semanticCategoryCreationForArray(labelArray) {
//   let category_array = [];
//   for (let index = 0; index < labelArray.length; index++) {
//     const element = labelArray[index];
//     let temp_category = semanticCategoryCreation(element.string);
//     if (temp_category) {
//       category_array.push(temp_category);
//     }
//   }

//   let result = {};
//   for (let i = 0; i < category_array.length; i++) {
//     if (result[category_array[i]]) {
//       result[category_array[i]]++;
//     } else {
//       result[category_array[i]] = 1;
//     }
//   }
//   let id = 0;
//   let frequencies = Object.keys(result).map((key) => ({
//     string: key,
//     frequency: result[key],
//     id: id++,
//   }));
//   return frequencies.filter((obj) => obj.frequency > 1);
// }

// function semanticCategoryCreation(label) {
//   let res;
//   console.log(label);
//   const path = "./classifier.json";
//   // let classifier = new natural.BayesClassifier();

//   if (fs.existsSync(path)) {
//     console.log("trained model file exists");
//     natural.BayesClassifier.load(
//       "classifier.json",
//       null,
//       function (err, classifier) {
//         console.log(classifier.classify(label));
//         res = classifier.classify(label);
//       }
//     );
//   } else {
//     console.log("file not found!");
//     let classifier1 = new natural.BayesClassifier();
//     classifier1.addDocument(
//       "Smile Light Happy Leisure Fun Cool Event ",
//       "Smiler & Easygoing"
//     );
//     classifier1.addDocument(
//       "Hairstyle Bracelet Fashion accessory Cap Hat Body jewelry Jewellery Earrings making  ",
//       "A Fashion Enthusiast "
//     );
//     classifier1.addDocument(" Field archery Arrow Target Elbow ", "An Archer");
//     classifier1.addDocument(
//       " Road Mountain Path Boots Wood Bird Lake Tints and shades Branch Natural Twig landscape Asphalt Travel Terrestrial plant Tree Botany Grass ",
//       " Hiking and Travelling"
//     );
//     classifier1.addDocument(
//       "Sunlight Lake Tints and shades Branch Natural Twig Grass ",
//       "Nature lover"
//     );
//     classifier1.addDocument(" Font Words Typography Document", "Writing");
//     classifier1.addDocument(
//       " Military camouflage uniform Marines Cargo pants Soldier Army Squad    ",
//       "Extolling Army Service"
//     );

//     classifier1.train();
//     res = classifier1.classify(label);

//     classifier1.save("classifier.json", function (err, classifier) {
//       // the classifier is saved to the classifier.json file!
//     });
//   }
//   return res;
// }
// module.exports = semanticCategoryCreationForArray;

// function semanticCategoryCreation(label) {
// i haven't subscribed to the api in rapid api but it would work if i do
//try and consoling the different parts - i believe the body is what we will need

//   const axios = require("axios");

//   const options = {
//     method: "GET",
//     url: `https://wordsapiv1.p.rapidapi.com/words/${label}/typeOf`,
//     headers: {
//       "X-RapidAPI-Key": "cddcfc5984msh4f6a815e3a56676p11a5f9jsn74d8dd7636af",
//       "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
//     },
//   };

//   axios
//     .request(options)
//     .then(function (response) {
//       console.log(response.data);
//     })
//     .catch(function (error) {
//       console.error(error);
//     });
// }
// module.exports = semanticCategoryCreation;
