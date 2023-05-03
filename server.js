require("@tensorflow/tfjs");
const fs = require("fs");
const express = require("express");
const https = require("https");
const http = require("http");
const cors = require("cors");
const dataMining = require("./controllers/data-mining");
// const { faceDetection } = require("./parsingData/face-detection");
// const { getLocations } = require("./parsingData/stringToLoc");

// vars for https
const privateKey = fs.readFileSync(__dirname + "/certs/selfsigned.key", "utf8");
const certificate = fs.readFileSync(
  __dirname + "/certs/selfsigned.crt",
  "utf8"
);
const credentials = { key: privateKey, cert: certificate };

const app = express();
app.use(cors());

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

// get request
app.get("/posts/", async (req, res) => {
  const code = req.query.code;
  let userId;
  if (code) {
    userId = await dataMining.setUpInstagram(code);
    // console.log(userId);
    res.status(200).send({ userId: userId });
  } else {
    fs.readFile("./idan.json", "utf8", (err, data) => {
      if (err) console.log("error!");
      if (data) {
        const products = JSON.parse(data);
        res.send(products);
      }
    });
  }
});

app.get("/", async (req, res) => {
  // fs.readFile("./idan.json", "utf8", async (err, data) => {
  //   if (err) console.log("error!");
  //   if (data) {
  //     const products = JSON.parse(data);
  //     const response = await faceDetection(products);
  //     const response = await getLocations(products);
  //     console.log("hello");
  //     res.send(response);
  //   } else {
  //     res.send("hello");
  //   }
  // });
  res.status(200).send("welcome to our server");
});

httpServer.listen(8000);
httpsServer.listen(8443);
