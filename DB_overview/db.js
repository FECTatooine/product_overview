const {Client } = require('pg');
require("dotenv").config()


// clients will also use environment variables
// for connection information
const db = new Client(
  {
  host: "3.17.203.213",
  port: "5432",
  user: "ubuntu",
  database: "postgres",
  password: "123456",
});

console.log(1);
db.connect().then(()=>{console.log('connect to database', "3.17.203.213")});


module.exports = db;