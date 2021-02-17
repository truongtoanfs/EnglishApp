const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// routes
const route = require('./routes');
// database
const db = require('./config/db');//automatic into ./config/db/index.js

// connect to database
db.connect();

// process json data
app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(express.json({limit: '50mb'}));

/* app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'})); */
 
// Serve static files
app.use(express.static('public'));

// route init for special resources
route(app);


 
app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
