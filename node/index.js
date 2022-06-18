const express = require("express");
const chance = require("chance").Chance();
const app = express();
const port = 3000;

const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "app",
};
const mysql = require("mysql");
const connection = mysql.createConnection(config);
connection.query(`
CREATE TABLE IF NOT EXISTS people (
  id INT NOT NULL AUTO_INCREMENT,
  name TEXT,
  PRIMARY KEY (id)
);
`);

app.get("/health", (req, res) => {
  res.end();
});

const SQL_INSERT = `INSERT INTO people(name) values(?)`;
const SQL_SELECT = `SELECT * FROM people`;

app.get("/", async (req, res) => {
  connection.query(SQL_INSERT, chance.name());

  connection.query(SQL_SELECT, function (error, results) {
    if (error != null) {
      res.status(500).end(error.message);
      return;
    }
    let response = "";
    response += "<h1>Full Cycle Rocks!</h1>";
    response += "<ul>";
    for (const row of results) {
      response += `<li>${row.name}</li>`;
    }
    response += "</ul>";
    res.status(200).end(response);
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
