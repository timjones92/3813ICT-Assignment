const express = require('express');
const app = express();

const cors = require('cors');
const http = require('http').Server(app);
var path = require('path');
var bodyParser = require('body-parser');
const io = require('socket.io')(http);
const sockets = require('./socket.js');
const server = require('./listen.js');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017';


// Using middleware to parse JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// Serve static content for the app
app.use(express.static(path.join(__dirname,'../dist/ChatApp/')));
const formidable = require('formidable');
const multipart = require('connect-multiparty');
app.use('/uploads', express.static(path.join(__dirname, 'api/uploads')));
// Get login route 
require('./routes/login.js')(app, path);
// Get channel route
require('./routes/channel.js')(app, path);

// Port for server
const PORT = 3000;

//Apply express middleware
app.use(cors());

// Use connect method to connect to the Server
MongoClient.connect(url, {poolSize:10, useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    if (err) { return console.log(err)}
        const dbName = 'chatdb'; // Database name
        const db = client.db(dbName);
        // const superUser = {
        //     username: "Super",
        //     password: "super",
        //     email: "superadmin@chatapp.com",
        //     role: "SuperAdmin",
        //     avatar: "../assets/default-avatar.jpg"
        // }
        // db.collection('users').deleteOne(superUser);
        // db.collection('users').insertOne(superUser);
        // db.collection('userchannels').deleteOne({channel: 0});
        require('./api/users.js')(db,app, ObjectID);
        require('./api/groups.js')(db,app, ObjectID);
        require('./api/channels.js')(db,app, ObjectID);
        require('./api/usergroups.js')(db, app);
        require('./api/userchannels.js')(db, app);
        require('./api/chats.js')(db,app, ObjectID);
        require('./api/avatar.js')(db, app, ObjectID, formidable, multipart);
});

//Setup socket
sockets.connect(io, PORT);

//Start server listening for requests.
server.listen(http,PORT);
