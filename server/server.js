const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const sockets = require('./socket.js');
const server = require('./listen.js');

// Port for server
const PORT = 3000;

//Apply express middleware
app.use(cors());

//Setup socket
sockets.connect(io, PORT);

//Start server listening for requests.
server.listen(http,PORT);