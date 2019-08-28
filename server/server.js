const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
var path = require('path');
var bodyParser = require('body-parser');
const io = require('socket.io')(http);
const sockets = require('./socket.js');
const server = require('./listen.js');
var fs = require('fs')

// Using middleware to parse JSON data
app.use(bodyParser.json());
// Serve static content for the app
//app.use(express.static(path.join(__dirname,'../dist/ChatApp/')));

// Get login route 
require('./routes/login.js')(app, path);

// Port for server
const PORT = 3000;

//Apply express middleware
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Get services for handling file requests
require('./routes/groupService.js')(app, fs);
require('./routes/userService.js')(app, fs);
require('./routes/channelService.js')(app, fs);

//Setup socket
sockets.connect(io, PORT);

//Start server listening for requests.
server.listen(http,PORT);
