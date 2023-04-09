require("@tensorflow/tfjs");
const fs = require("fs");
const express = require("express");
const https = require("https");
const http = require("http");
const cors = require("cors");
const dataMining = require("./controllers/data-mining");
// const { getLocationFromString } = require("./parsingData/stringToLoc");
// const { faceDetection } = require("./parsingData/face-detection");

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
    console.log(userId);
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
  res.status(200).send("welcome to our project");
});
// getLocationFromString("chilling in Clei Zemer Beer Sheva");
httpServer.listen(8000);
httpsServer.listen(8443);
