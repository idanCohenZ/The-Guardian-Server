async function labelsFromImg(postArray) {
  let categoryLableArray = [];
  //assuming i have the post array as js object!

  for (let index = 0; index < postArray.length; index++) {
    const post = postArray[index];
    //
    //downloading the images as batch? => check if needed- it can read an online image!
    //
    postImg = post.media_url;
    postCate = await setEndpoint(postImg);
    categoryLableArray.push(postCate);
  }
  return categoryLableArray;
}

async function setEndpoint(postImg) {
  // Imports the Google Cloud client library
  const vision = require("@google-cloud/vision");

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: `./keycred-secret.json`,
  });

  const [result] = await client.labelDetection(`${postImg}`);
  const labels = result.labelAnnotations;

  let category_array = [];
  labels.forEach((label) => {
    let temp_category = semanticCategoryCreation(label.description);
    temp_category = JSON.parse(temp_category);
    if (temp_category) {
      category_array.append(temp_category);
    }
  });

  let labelArray = [];
  for (let label of labels) {
    labelArray.append[label.description];
  }

  let categories_from_post = combineArrays(labelArray, category_array);

  return categories_from_post;
}

function combineArrays(arr1, arr2) {
  const result = [];

  // Add all strings from arr1 to the result
  for (let str of arr1) {
    result.push(str);
  }

  // Add objects with counters for strings in arr2
  const counts = {};
  for (let str of arr2) {
    if (counts[str]) {
      counts[str]++;
    } else {
      counts[str] = 1;
    }
  }

  for (let str in counts) {
    const obj = { string: str, counter: counts[str] };
    result.push(obj);
  }

  return result;

  //results:
  //  const arr1 = ['apple', 'banana', 'orange'];
  // const arr2 = ['apple', 'banana', 'banana', 'pear', 'apple'];

  // const result = combineArrays(arr1, arr2);

  // console.log(result);
  // ['apple', 'banana', 'orange', { string: 'pear', counter: 1 }, { string: 'apple', counter: 2 }, { string: 'banana', counter: 2 }]
}