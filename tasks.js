const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/tasks", function(req, res) {
  
  //res.send({ tasks: ["water plants", "do dishes", "buy oats"] });

  const exTasks = [
    {
      id: 1,
      description: "Buy milk",
      completed: false
    },
    {
      id: 2,
      description: "Buy some apples",
      completed: false
    },
    {
      id: 3,
      description: "Buy coffee",
      completed: false
    }
  ];

  res.json(exTasks);
});

app.delete("/tasks/:taskId", function(req, res) {

  const id = req.params.taskId;

  if(id > 3) {
    res.status(404);
    res.json({
      message: `Task ID: ${id} does not exist.`
    });
  }

  res.json({
    message: `You issued a delete request for ID: ${id}`
  });
});

app.post("/tasks", function(req, res) {
  const text = req.body.text;
  const date = req.body.date;

  res.status(201);
  res.json({
    message: `Received a request to add task ${text} with date ${date}`
  });
});

app.put("/tasks/:taskId", function(req, res) {

  const id = req.params.taskId;
  const completed = req.body.completed;

  res.json({
    message: `You issued a put request for ID: ${id}, 'completed'= ${completed}`
  });
});

module.exports.handler = serverless(app);



