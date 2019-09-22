module.exports = function(db, app, ObjectID) {
    //Route to manage adding a channel
    app.post('/api/addChannel', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        channel = req.body;
        const collection = db.collection('channels');
        // Check for dupliacte id's
        collection.find({'channelID': channel.channelID}).count((err, count) => {
            if (count == 0) {
                //if no duplicate
                collection.insertOne(channel, (err, dbres) => {
                    if (err) throw err;
                    let num = dbres.insertedCount;
                    //send back to client number of items inserted and no error message
                    res.send({'num':num, err:null});
                })
            } else {
                // On error, send back error message
                res.send({num:0, err:"duplicate item"});
            }
        });
    });

    // Route to get list of all channels from the database
    app.get('/api/allChannelsList', function(req,res) {
        const collection = db.collection('channels');
        collection.find({}).toArray((err, data) => {
            res.send(data);
        });
    });

    // Route to update all channels
    app.post('/api/updateChannels', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        channels = req.body;
        const collection = db.collection('channels');
        for (let i = 0; i < channels.length; i++) {
            var objectid = new ObjectID(channels[i]._id);
            collection.updateMany({_id:objectid}, {$set:{groupID:channels[i].groupID, groupName:channels[i].groupName, channelID:channels[i].channelID, channelName:channels[i].channelName}}, () => {
                        
            });
        }
        // Return a response to the client to let them know the update was successful
        res.send({'ok': channels});
    });

    // Route to delete a single channel
    app.post('/api/deleteChannel', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        channel = req.body;
        // Create a new mongo Object ID from the passed in _id
        var objectid = new ObjectID(channel._id);
        const collection = db.collection('channels');
        // Delete a single product based on unique ID
        collection.deleteOne({_id:objectid}, (err, docs) => {
            // Get a new listing of all items in the database and return to client
            collection.find({}).toArray((err, data) => {
                // Return a response to the client to let them know the delete was successful
                res.send(data);
            });
        });
    });

}