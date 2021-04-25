const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;//port dependent host environment my pc / heroku...

// routes
const route = require('./routes');
// database
const db = require('./config/db');//automatic into ./config/db/index.js

// connect to database
db.connect();
// fixed CORS policy
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
})
// process json data
app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(express.json({limit: '50mb'}));

// Serve static files
app.use(express.static('docs'));

// route init for special resources
route(app);


 
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
