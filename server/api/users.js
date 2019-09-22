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
        const collection = db.collection('users');
        for (let i = 0; i < users.length; i++) {
            var objectid = new ObjectID(users[i]._id);
            collection.updateOne({_id:objectid}, {$set:{username:users[i].username, password:users[i].password, email:users[i].email, role:users[i].role, avatar:users[i].avatar}}, () => {
                
            })
        }
        // Return a response to the client to let them know the update was successful
        res.send({'ok': users});
        
        
    });

    // Route to delete a single user
    app.post('/api/deleteUser', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        user = req.body;
        // Create a new mongo Object ID from the passed in _id
        var objectid = new ObjectID(user._id);
        const collection = db.collection('users');
        // Delete a single product based on unique ID
        collection.deleteOne({_id:objectid}, (err, docs) => {
            // Get a new listing of all items in the database and return to client
            collection.find({}).toArray((err, data) => {
                // Return a response to the client to let them know the delete was successful
                res.send(data);
            });
        });
    });

    // Server-side validation if groupID exists
    app.post('/api/checkvaliduserid', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        user = req.body;
        const collection = db.collection('users');
        // Check for duplicate id's
        collection.find({'username':user.username}).count((err, count) => {
            if (count == 0) {
                res.send({success:1});
            } else {
                res.send({success:0});
            }
        });
    });
}