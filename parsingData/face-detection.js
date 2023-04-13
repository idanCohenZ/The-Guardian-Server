const canvas = require("canvas");
const faceapi = require("@vladmandic/face-api");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const faceDetection = async (postsArray) => {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + "/models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/models");
  await faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname + "/models");
  // get array of single images
  const singleFaces = await extractFaces(postsArray.data);
  // search for match in different images
  let result = [];
  for (let i = 0; i < singleFaces.length; i++) {
    if (singleFaces[i].status === 0) {
      singleFaces[i].status = 1;
      result = [...result, { image: singleFaces[i].image, freq: 1 }];
      for (let j = i; j < singleFaces.length; j++) {
        if (singleFaces[j].status === 0) {
          const ans = await findMatchBetweenFaces(
            singleFaces[i].image,
            singleFaces[j].image
          );
          if (ans) {
            singleFaces[j].status = 1;
            result[result.length - 1].freq += 1;
          }
        }
      }
    }
  }
  // console.log(result);
  for (let i = 0; i < result.length; i++) {
    result[i].image = result[i].image[0].toDataURL();
  }
  return result;
};

// build array of faces
const extractFaces = async (arrayOfPosts) => {
  // console.log(arrayOfPosts);
  let imagesArray = [];
  for (let i = 0; i < arrayOfPosts.length; i++) {
    if (arrayOfPosts[i].media_type === "IMAGE") {
      const image = await canvas.loadImage(arrayOfPosts[i].media_url);
      const detections = await faceapi.detectAllFaces(image);
      if (detections && detections.length < 10) {
        for (let j = 0; j < detections.length; j++) {
          const regionsToExtract = [
            new faceapi.Rect(
              detections[j]._box._x,
              detections[j]._box._y,
              detections[j]._box._width,
              detections[j]._box._height
            ),
          ];
          let faceImages = await faceapi.extractFaces(image, regionsToExtract);
          imagesArray = [...imagesArray, { image: faceImages, status: 0 }];
        }
      }
    }
  }
  return imagesArray;
};

// find match between faces
const findMatchBetweenFaces = async (img1, img2) => {
  const facesFromImage1 = await faceapi
    .detectAllFaces(img1)
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (facesFromImage1[0]) {
    const faceMatcher = new faceapi.FaceMatcher(facesFromImage1);

    const facesFromImage2 = await faceapi
      .detectAllFaces(img2)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (facesFromImage2[0]) {
      const bestMatch = faceMatcher.findBestMatch(
        facesFromImage2[0].descriptor
      );
      if (faceMatcher.labeledDescriptors[0].label === bestMatch._label) {
        return true;
      }
    }
  }
  return false;
};

module.exports = { faceDetection };
