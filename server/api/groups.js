module.exports = function(db, app, ObjectID) {
    //Route to manage adding a group
    app.post('/api/addGroup', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        group = req.body;
        const collection = db.collection('groups');
        // Check for dupliacte id's
        collection.find({'groupID': group.groupID}).count((err, count) => {
            if (count == 0) {
                //if no duplicate
                collection.insertOne(group, (err, dbres) => {
                    if (err) throw err;
                    collection.find({}).toArray((err, data) => {
                        //send back to client all groups which now includes new group added
                        res.send(data);
                    });
                    
                });
            } else {
                // On error, send back error message
                res.send({num:0, err:"duplicate item"});
            }
        });
    });

    // Route to get list of all groups from the database
    app.get('/api/allGroupsList', function(req,res) {
        const collection = db.collection('groups');
        collection.find({}).toArray((err, data) => {
            res.send(data);
        });
    });

    // Route to update all groups
    app.post('/api/updateGroups', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        groups = req.body;
        const collection = db.collection('groups');
        const channelsCollection = db.collection('channels');
        const userGroupsCollection = db.collection('usergroups');
        const userChannelsCollection = db.collection('userchannels');
        const groupAssisCol = db.collection('groupassis');

        for (let i = 0; i < groups.length; i++) {
            var objectid = new ObjectID(groups[i]._id);
            groupAssisCol.updateMany({groupID:groups[i].groupID}, {$set:{groupName:groups[i].groupName}});
            channelsCollection.updateMany({groupID:groups[i].groupID}, {$set:{groupName:groups[i].groupName}});
            userGroupsCollection.updateMany({groupID:groups[i].groupID}, {$set:{groupName:groups[i].groupName}});
            userChannelsCollection.updateMany({groupID:groups[i].groupID}, {$set:{groupName:groups[i].groupName}});
            collection.updateOne({_id:objectid}, {$set:{groupID:groups[i].groupID, groupName:groups[i].groupName}}, () => {
                        
            });
        }
        // Return a response to the client to let them know the update was successful
        collection.find({}).toArray((err, gdata) => {
            channelsCollection.find({}).toArray((err, cdata) => {
                userGroupsCollection.find({}).toArray((err, ugdata) => {
                    userChannelsCollection.find({}).toArray((err, ucdata) => {
                        groupAssisCol.find({}).toArray((err, gadata) => {
                            // Return a response to the client to let them know the delete was successful
                            res.send({'gdata': gdata, 'cdata': cdata, 'ugdata': ugdata, 'ucdata': ucdata, 'gadata': gadata});
                        });
                    });
                });
            });
        });
    });

    // Route to delete a single group
    app.post('/api/deleteGroup', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        group = req.body;
        // Create a new mongo Object ID from the passed in _id
        var objectid = new ObjectID(group._id);
        const groupCollection = db.collection('groups');
        const channelsCollection = db.collection('channels');
        const userGroupsCollection = db.collection('usergroups');
        const userChannelsCollection = db.collection('userchannels');
        const groupAssisCol = db.collection('groupassis');

        // Delete all the selected group's channels
        groupAssisCol.deleteMany({groupID: group.groupID});
        // Delete all the selected group's channels
        channelsCollection.deleteMany({groupID: group.groupID});
        // Delete all the selected group's users
        userGroupsCollection.deleteMany({groupID: group.groupID});
        // Delete all the selected group's channel users
        userChannelsCollection.deleteMany({groupID: group.groupID});
        // Delete a single product based on unique ID
        groupCollection.deleteOne({_id:objectid}, (err, docs) => {
            if (err) {
                console.log("Deleting group error: " + err)
            }
        });

        // Get a new listing of all items in the database and return to client
        channelsCollection.find({}).toArray((err, cdata) => {
            userGroupsCollection.find({}).toArray((err, ugdata) => {
                userChannelsCollection.find({}).toArray((err, ucdata) => {
                    groupCollection.find({}).toArray((err, gdata) => {
                        // Return a response to the client to let them know the delete was successful
                        res.send({'gdata': gdata, 'cdata': cdata, 'ugdata': ugdata, 'ucdata': ucdata});
                    });
                });
            });
        });
    });

    //Route to manage adding a user to a group
    app.post('/api/addNewGroupAssis', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        group = req.body.group;
        user = req.body.user;
        const collection = db.collection('groupassis');
        
        // Insert new user and the selected group to groupassis collection
        collection.insertOne(
            {
                groupID: group.groupID, 
                groupName: group.groupName, 
                userID: user._id, 
                username: user.username
            }, 
            (err, dbres) => {
                if (err) throw err;
            //send back to client number of items inserted and no error message
            collection.find({}).toArray((err, data) => {
                res.send(data);
            });
        });
    });

    // Route to delete a user from a group
    app.post('/api/deleteGroupAssis', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        groupAssis = req.body;
        const groupAssisCol = db.collection('groupassis');
        var objectid = new ObjectID(groupAssis._id);
        // Delete a single product based on unique ID
        groupAssisCol.deleteOne({_id: objectid}, (err, docs) => {
            if (err) throw err;
            // Send return message of Group Assis with newly deleted Group Assis
            groupAssisCol.find({}).toArray((err, data) => {
                res.send(data);
            });
        });
        
    });

    // Route to get list of all group users from the database
    app.get('/api/getGroupAssisList', function(req,res) {
        const collection = db.collection('groupassis');
        collection.find({}).toArray((err, data) => {
            res.send(data);
        });
    });
}