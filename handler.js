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
  database: "todo_app_db"
});

//GET-TASK

app.get("/tasks", function(req, res) {

  const query = "SELECT * FROM task_list;"

  connection.query(query, function(error, data) {
    if(error) {
      console.log("Error fetching tasks", error);
      res.status(500).json({
        error: error
      });
    } else {
      res.status(200).json({
        task_list: data
      });
    }
  });
});

//POST-TASK

app.post("/tasks", function(req, res) {

  const query = "INSERT INTO task_list (task_id, task_description, completed, due_date, user_id) VALUES (?, ?, ?, ?, ?);";

  const querySelect = "SELECT * FROM task_list WHERE task_id = ?;";


  connection.query(query, [req.body.task_id, req.body.task_description, req.body.completed, req.body.due_date, req.body.user_id], function(error, data){
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
          task_list: data
         });
       }
     });
     
    }
  });
});

//DELETE-TASK

app.delete("/tasks/:taskId", function(req, res) {

  const id = req.params.taskId;

  const query = "DELETE FROM task_list WHERE task_id = ?;";

  connection.query(query, [id], function(error, data){
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

  const query = "UPDATE task_list SET task_description = ?, completed = ?, due_date = ? WHERE task_id = ?;";

  connection.query(query, [req.body.task_description, req.body.completed, req.body.due_date, id], function(error, data){
    if(error) {
      console.log("Error handling tasks", error);
      res.status(500).json({
        error: error
      });
    } else {
      res.status(200).json({
        task_list: data
       });
    }
  });
});

module.exports.tasks = serverless(app);



