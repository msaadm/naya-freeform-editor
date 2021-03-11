const express = require("express")
const mongoose = require("mongoose") 
const routes = require("./routes")
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors     = require('cors');

const app = express()

// configure app
app.use(morgan('dev'));

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

var port     = process.env.PORT || 5000

// DATABASE SETUP
mongoose.connect('mongodb://localhost:27017/naya'); // connect to our database

// Handle the connection event
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("DB connection alive");
});

app.use("/api", routes)

app.listen(port, () => {
    console.log("Server has started on http://localhost:5000")
})
