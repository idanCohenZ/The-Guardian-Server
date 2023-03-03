const fs = require("fs");
const express = require("express");
const https = require("https");
const http = require("http");
const cors = require("cors");
const configuration = require("./configuration");

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

app.get("/posts/", (req, res) => {
  const code = req.query.code;
  if (code) {
    //console.log(code);
    configuration.getPosts(code);
  }

  fs.readFile("./idan.json", "utf8", (err, data) => {
    if (err) console.log("error!");
    if (data) {
      const products = JSON.parse(data);
      res.send(products);
    }
  });
});

app.get("/", (req, res) => {
  console.log("hello world main");
});
httpServer.listen(8000);
httpsServer.listen(8443);
