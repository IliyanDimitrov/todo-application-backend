const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "tasks"
});

//GET-TASK

app.get("/tasks", function(req, res) {

  const query = "SELECT * FROM task;"

  connection.query(query, function(error, data) {
    if(error) {
      console.log("Error fetching tasks", error);
      res.status(500).json({
        error: error
      });
    } else {
      res.status(200).json({
        tasks: data
      });
    }
  });
});

//POST-TASK

app.post("/tasks", function(req, res) {

  const query = "INSERT INTO task (description, completed, due_date, user_id) VALUES (?, ?, ?, ?);";

  const querySelect = "SELECT * FROM task WHERE task_id = ?;";


  connection.query(query, [req.body.description, req.body.completed, req.body.due_date, req.body.user_id], function(error, data){
    if(error) {
      console.log("Error handling tasks", error);
      res.status(500).json({
        error: error
      });
    } else {
     connection.query(querySelect, [req.body.task_id], function(error, data){
       if(error) {
        console.log("Error handling tasks", error);
        res.status(500).json({
          error: error
        });
       } else {
         res.status(201).json({
          task: data
         });
       }
     });
     
    }
  });
});

//DELETE-TASK

app.delete("/tasks/:taskId", function(req, res) {

  const id = req.params.taskId;

  const query = "DELETE FROM task WHERE task_id = ?;";

  connection.query(query, id, function(error, data){
    if(error) {
      console.log("Error handling tasks", error);
      res.status(404).json({
        error: error
      });
    } else {
      res.status(200);
    }
  });
});

//PUT-TASK

app.put("/tasks/:taskId", function(req, res) {

  const id = req.params.taskId;

  const query = "UPDATE task SET description = ?, completed = ?, due_date = ? WHERE task_id = ?;";

  connection.query(query, [req.body.description, req.body.completed, req.body.due_date, id], function(error, data){
    if(error) {
      console.log("Error handling tasks", error);
      res.status(500).json({
        error: error
      });
    } else {
      res.status(200).json({
        task: data
       });
    }
  });
});

module.exports.tasks = serverless(app);



