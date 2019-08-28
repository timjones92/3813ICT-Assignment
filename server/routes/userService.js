module.exports = function(app, fs) {
    // User list to send to file
    var userList = { users: [] };
    
    app.post("/api/saveUser", (req, res) => {
        // Read file to get initial data
        fs.readFile('users.txt', 'utf8', function(err, data) {
            if (err) {
                console.log(err);
            } else {
                res.send(req.body);
                if (data.length !== 0) {
                    userList = JSON.parse(data);
                    //console.log("Req body equals: " + JSON.stringify(req.body))
                    userList.users.push(req.body);
                    var json = JSON.stringify(userList);
                    console.log('This is the new user from modal: ' + req.body.username);
                    // Write to file current user list plus newly added user
                    fs.writeFile('users.txt', json, 'utf8', function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Added', req.body.username, 'to file.')
                            // Return user to form field
                            app.get("/api/getUser", function(req, res) {
                                fs.readFile('users.txt', 'utf8', function (err, data) {
                                    if (err) {
                                        res.send(err);
                                    } else {
                                        //console.log(data)
                                        setTimeout(function() {
                                            res.send(data);
                                            //console.log('Passing back object: ' + data);
                                        },
                                        500);
                                    }
                                });
                            });
                        }
                    });
                }
            }
        });
    });

    // Get all data from users file for init
    app.get("/api/getAllUsers", function(req, res) {
        fs.readFile('users.txt', 'utf8', function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                //console.log('Passing back all users: ' + data);
            }
        });
    });

    // Get update values and overwrite file with updated values
    app.post("/api/updateUser", function(req, res) {
        res.send(req.body);
        userList.users = req.body;
        jsonUpdated = JSON.stringify(userList);
        fs.writeFile('users.txt', jsonUpdated, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Updated file with new values.");
            }
        });
    });
    
    // Get object to delete and delete it from Groups file
    app.post("/api/deleteUser", function (req, res) {
        res.send(req.body);
        fs.readFile('users.txt', 'utf8', function (err, data) {
            if (err) {
                res.send(err);
            } else {
                userList = JSON.parse(data);
                var selectedGroup = req.body;
                indexToDelete = userList.users.findIndex(x => x.username === selectedGroup.username);
                userList.users.splice(indexToDelete, 1);
                json = JSON.stringify(userList);
                fs.writeFile('users.txt', json, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Deleted " + selectedGroup + " from groups file.");
                    }
                });
            }
        });
    });

    app.post("/api/addUserToGroup", function(req, res) {
        res.send(req.body);
        var groupToAdd = req.body.group;
        var user = req.body.user;
        fs.readFile('users.txt', 'utf8', function(err, data) {
            if (err) {
                res.send(err);
            } else {
                userList = JSON.parse(data);
                var indexOfUser = userList.users.findIndex(u => u.username === user);
                var updatedUser = userList.users[indexOfUser]
                //console.log(updatedUser)
                if (updatedUser.groups === undefined) {
                    updatedUser.groups = []
                }
                updatedUser.groups.push({"groupName": groupToAdd});
                jsonToFile = JSON.stringify(userList);
                fs.writeFile('users.txt', jsonToFile, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Added", user, "to group", groupToAdd);
                    }
                });
            }
        })
    });
}