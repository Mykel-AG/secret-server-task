"use strict"

require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const Routes = require('./app/routes');
const db = require("./app/models");

app.use(cors({ origin: ["http://localhost:8081", "http://localhost:3000"],  }));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use('/', Routes);



db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true, 
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });


module.exports = app