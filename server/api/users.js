module.exports = function(db, app, ObjectID) {
    //Route to manage adding a user
    app.post('/api/addUser', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        user = req.body;
        const collection = db.collection('users');
        // Check for dupliacte id's
        collection.find({'username': user.username}).count((err, count) => {
            if (count == 0) {
                //if no duplicate
                collection.insertOne(user, (err, dbres) => {
                    if (err) throw err;
                    collection.find({}).toArray((err, data) => {
                        //send back to client all users including newly added user
                        res.send(data);
                    });
                });
            } else {
                // On error, send back error message
                res.send({num:0, err:"duplicate item"});
            }
        });
    });

    // Route to get list of all users from the database
    app.get('/api/allUsersList', function(req,res) {
        const collection = db.collection('users');
        collection.find({}).toArray((err, data) => {
            res.send(data);
        });
    });

    // Route to update all users
    app.post('/api/updateUsers', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        users = req.body;
        const userCollection = db.collection('users');
        const userGroupsCollection = db.collection('usergroups');
        const userChannelsCollection = db.collection('userchannels');

        for (let i = 0; i < users.length; i++) {
            // Create a new mongo Object ID from the passed in _id
            var objectid = new ObjectID(users[i]._id);
            // Update username in user groups
            userGroupsCollection.updateMany({userID: users[i]._id}, {$set:{username: users[i].username}});
            // Update username in user channels
            userChannelsCollection.updateMany({userID: users[i]._id}, {$set:{username: users[i].username}});
            // For each user, update with their new values
            userCollection.updateOne({_id:objectid}, {$set:{username:users[i].username, password:users[i].password, email:users[i].email, role:users[i].role, avatar:users[i].avatar}}, () => {
                
            });
        }
        
        userChannelsCollection.find({}).toArray((err, ucdata) => {
            userGroupsCollection.find({}).toArray((err, ugdata) => {
                userCollection.find({}).toArray((err, udata) => {
                    // Return a response to the client with all updated username values
                    res.send({'udata': udata, 'ugdata': ugdata, 'ucdata': ucdata});
                });
            });
        });
        
        
        
    });

    // Route to delete a single user
    app.post('/api/deleteUser', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        user = req.body;
        // Create a new mongo Object ID from the passed in _id
        var objectid = new ObjectID(user._id);
        const userCollection = db.collection('users');
        const userGroupsCollection = db.collection('usergroups');
        const userChannelsCollection = db.collection('userchannels');
        
        // Delete selected user from all their groups
        userGroupsCollection.deleteMany({user: user.username});
        // Delete selected user from all their channels
        userChannelsCollection.deleteMany({user: user.username});
        // Delete a single product based on unique ID
        userCollection.deleteOne({_id:objectid}, (err, docs) => {
            if (err) throw err;
        });

        // Get a new listing of all items in the database and return to client
        userChannelsCollection.find({}).toArray((err, ucdata) => {
            userGroupsCollection.find({}).toArray((err, ugdata) => {
                userCollection.find({}).toArray((err, udata) => {
                    // Return a response to the client to let them know the delete was successful
                    res.send({'udata':udata, 'ugdata':ugdata, 'ucdata':ucdata});
                });
            });
        });
    });

    // Server-side validation if groupID exists
    app.post('/api/checkvaliduser', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        user = req.body;
        const collection = db.collection('users');
        // Check for duplicate id's
        collection.find({'username':user.username, 'password':user.password}).count((err, count) => {
            if (count == 0) {
                res.send({success: 0})
            } else {
                res.send({success: 1})
            }
        });
    });
}