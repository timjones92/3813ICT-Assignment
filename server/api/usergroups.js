module.exports = function(db, app, ObjectID) {
    //Route to manage adding a user to a group
    app.post('/api/addUserToGroup', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        group = req.body.group;
        user = req.body.user;
        const collection = db.collection('usergroups');
        // Check for duplicate id's
        collection.find({'groupID': group.groupID, 'username':user}).count((err, count) => {
            if (count == 0) {
                //if no duplicate
                collection.insertOne({group: group.groupID, user: user}, (err, dbres) => {
                    if (err) throw err;
                    //send back to client number of items inserted and no error message
                    collection.find({}).toArray((err, data) => {
                        res.send(data);
                    });
                });
            } else {
                // On error, send back error message
                res.send({err:"User already in group"});
            }
        });
    });

    // Route to delete a user from a group
    app.post('/api/deleteUserFromGroup', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        group = req.body.group;
        user = req.body.user;
        
        const userGroupCol = db.collection('usergroups');
        const userChannelCol = db.collection('userchannels');
        // Delete a single product based on unique ID
        userGroupCol.deleteOne({group:group.groupID, user: user}, (err, docs) => {
            userChannelCol.deleteMany({group:group.groupID, user: user});
            // Get a new listing of all items in the database and return to client
            userGroupCol.find({}).toArray((err, ugdata) => {
                userChannelCol.find({}).toArray((err, ucdata) => {
                    // Return a response to the client to let them know the delete was successful
                    res.send({'ugdata':ugdata, 'ucdata':ucdata});
                })
                
            });
        });
    });

    // Route to get list of all group users from the database
    app.get('/api/allGroupUsersList', function(req,res) {
        const collection = db.collection('usergroups');
        collection.find({}).toArray((err, data) => {
            res.send(data);
        });
    });

}