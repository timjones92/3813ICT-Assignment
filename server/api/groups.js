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
        for (let i = 0; i < groups.length; i++) {
            var objectid = new ObjectID(groups[i]._id);
            collection.updateMany({_id:objectid}, {$set:{groupID:groups[i].groupID, groupName:groups[i].groupName}}, () => {
                        
            });
        }
        // Return a response to the client to let them know the update was successful
        res.send({'ok': groups});
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

        // Delete all the selected group's channels
        channelsCollection.deleteMany({groupID: group.groupID});
        // Delete all the selected group's users
        userGroupsCollection.deleteMany({group: group.groupID});
        // Delete all the selected group's channel users
        userChannelsCollection.deleteMany({group: group.groupID});
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

    // Server-side validation if groupID exists
    app.post('/api/checkvalidgroupid', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        group = req.body;
        const collection = db.collection('groups');
        // Check for duplicate id's
        collection.find({'groupID':group.id}).count((err, count) => {
            if (count == 0) {
                res.send({success:1, topnum:0});
            } else {
                // On send back highest used number
                collection.find({}, {sort: {id: -1}, limit: 1}).toArray(function(err, items) {
                    res.send({success:0, topnum:items[0].id});
                });
            }
        });
    });
}