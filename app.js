var mysql = require('mysql');

var con = mysql.createConnection({
  host: "35.224.230.100",
  user: "admin",
  password: "admin"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});