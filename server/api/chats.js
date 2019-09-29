module.exports = function(db, app, ObjectID) {
    //Route to manage adding a new message in a channel
    app.post('/api/newChannelMessage', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        message = req.body.message;
        timestamp = req.body.timestamp;
        channel = req.body.channel;
        user = req.body.user;
        const collection = db.collection('chats');
        //if no duplicate
        collection.insertOne({
            'message': message, 
            'timestamp': timestamp, 
            'channelID': channel.channelID, 
            'channelName': channel.channelName, 
            'userID': user._id,
            'username': user.username,
            'userimg': user.avatar,
            'isImage': false
        }, (err, dbres) => {
            if (err) throw err;
            collection.find({'channelID': channel.channelID}).toArray((err, data) => {
                //send back to client all messages for channel including newly added message
                res.send(data);
            });
        });
    });
    
    // Route to get list of all messages for particular channel from the database
    app.post('/api/allChannelMessages', function(req,res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        channel = req.body;
        const collection = db.collection('chats');
        collection.find({'channelID': channel.channelID}).toArray((err, data) => {
            res.send(data);
        });
    });

    //
    app.post('/api/deleteAllChannelMessages', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        channel = req.body;
        const collection = db.collection('chats');
        collection.deleteMany({'channelID': channel.channelID}, () => {
            collection.find({'channelID': channel.channelID}).toArray((err, data) => {
                res.send(data);
            });
        });
        
    });

    //Route to manage adding a new message in a channel
    app.post('/api/addNewChatImage', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        message = req.body.message;
        timestamp = req.body.timestamp;
        channel = req.body.channel;
        user = req.body.user;
        const collection = db.collection('chats');
        //if no duplicate
        collection.insertOne({
            'message': message, 
            'timestamp': timestamp, 
            'channelID': channel.channelID, 
            'channelName': channel.channelName, 
            'userID': user._id,
            'username': user.username,
            'userimg': user.avatar,
            'isImage': true
        }, (err, dbres) => {
            if (err) throw err;
            collection.find({'channelID': channel.channelID}).toArray((err, data) => {
                //send back to client all messages for channel including newly added message
                res.send(data);
            });
        });
    });
}