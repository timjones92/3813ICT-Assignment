module.exports = function(db, app, ObjectID) {
    //Route to manage adding a user to a channel
    app.post('/api/addUserToChannel', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        group = req.body.group;
        user = req.body.user;
        channel = req.body.channel;
        const collection = db.collection('userchannels');
        // Check for duplicate id's
        collection.find({'channelID': channel.channelID, 'groupID': group.groupID, 'userID': user.userID}).count((err, count) => {
            if (count == 0) {
                //if no duplicate
                collection.insertOne({'channelID': channel.channelID, 'channelName': channel.channelName, 'groupID': group.groupID, 'groupName': group.groupName, 'userID': user.userID, 'username':user.username}, (err, dbres) => {
                    if (err) throw err;
                    //send back to client number of items inserted and no error message
                    collection.find({}).toArray((err, data) => {
                        res.send(data);
                    });
                });
            } else {
                // On error, send back error message
                res.send({err:"User already in channel"});
            }
        });
    });

    // Route to delete a user from a group
    app.post('/api/deleteUserFromChannel', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        group = req.body.group;
        user = req.body.user;
        channel = req.body.channel;
        const collection = db.collection('userchannels');
        // Delete a single product based on unique ID
        collection.deleteOne({channelID:channel.channelID, groupID:group, userID: user.userID}, (err, docs) => {
            // Get a new listing of all items in the database and return to client
            collection.find({}).toArray((err, data) => {
                // Return a response to the client to let them know the delete was successful
                res.send(data);
            });
        });
    });

    // Route to get list of all group users from the database
    app.get('/api/allChannelUsersList', function(req,res) {
        const collection = db.collection('userchannels');
        collection.find({}).toArray((err, data) => {
            res.send(data);
        });
    });
    
}