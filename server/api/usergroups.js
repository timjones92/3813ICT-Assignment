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
        // Create a new mongo Object ID from the passed in _id
        // var groupobjectid = new ObjectID(group._id);
        // var userobjectid = new ObjectID(user._id);
        const collection = db.collection('usergroups');
        // Delete a single product based on unique ID
        collection.deleteOne({group:group.groupID, user: user}, (err, docs) => {
            // Get a new listing of all items in the database and return to client
            collection.find({}).toArray((err, data) => {
                // Return a response to the client to let them know the delete was successful
                res.send(data);
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