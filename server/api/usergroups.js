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
        collection.find({'groupID': group.groupID, 'userID': user._id}).count((err, count) => {
            if (count == 0) {
                //if no duplicate
                collection.insertOne({groupID: group.groupID, groupName: group.groupName, userID: user._id, username: user.username}, (err, dbres) => {
                    if (err) throw err;
                    //send back to client all user groups
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
        const groupAssisCol = db.collection('groupassis');

        // Delete a single usergroup based on unique ID
        userGroupCol.deleteOne({groupID:group.groupID, userID: user.userID}, (err, docs) => {

        });
        groupAssisCol.deleteMany({groupID:group.groupID, userID: user.userID});
        userChannelCol.deleteMany({groupID:group.groupID, userID: user.userID});
        // Get a new listing of all items in the database and return to client
        userChannelCol.find({}).toArray((err, ucdata) => {
            groupAssisCol.find({}).toArray((err, gadata) => {
                userGroupCol.find({}).toArray((err, ugdata) => {
                    // Return a response to the client to let them know the delete was successful
                    res.send({'ugdata':ugdata, 'ucdata':ucdata, 'gadata': gadata});
                });
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