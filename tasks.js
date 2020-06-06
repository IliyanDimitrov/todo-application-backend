const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/tasks", function(req, res) {
  res.send({ tasks: ["water plants", "do dishes", "buy oats"] });
});

module.exports.handler = serverless(app);