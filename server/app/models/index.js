const mongoose = require("mongoose");
const db = {};
db.mongoose = mongoose;
db.url = process.env.DATABASE_URL;
db.secrets = require("./secret.model.js")(mongoose);
module.exports = db;
