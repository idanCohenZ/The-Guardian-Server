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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.use(cors());

// app.set("view-engine", "ejs");

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

// get request for instagram request
app.get("/posts/", async (req, res) => {
  const code = req.query.code;
  let userId;
  if (code) {
    userId = await dataMining.setUpInstagram(code);
    res.status(200).send({ userId: userId });
    // res.render("user-found", { userId: userId });
  } else {
    res.status(200).send("user not found");
  }
});

// post request for client
app.post("/analyze", async (req, res) => {
  const user_id = req.body.userId;
  const analyzedData = await dataMining.getAnalyzedDataFromDb(user_id);
  res.status(200).send(analyzedData);
});

app.get("/", async (req, res) => {
  res.status(200).send("welcome to our server");
});

httpServer.listen(8000);
httpsServer.listen(8443);
