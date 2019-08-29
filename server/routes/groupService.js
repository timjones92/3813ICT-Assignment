module.exports = function(app, fs) {
    var groupList = { groups: [] };

    app.post("/api/saveGroup", (req, res) => {
        fs.readFile('db.txt', 'utf8', function(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log("Data from file initial: " + data);
                res.send(req.body);
                if (data.length !== 0) {
                    groupList = JSON.parse(data);
                    console.log("Group list from file is: " + groupList)
                    console.log("Req body equals: " + JSON.stringify(req.body))
                    groupList.groups.push(req.body);
                    var json = JSON.stringify(groupList);
                    console.log('This is the new group from modal: ' + req.body.groupName);
                    
                    fs.writeFile('db.txt', json, 'utf8', function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Added', req.body.groupName, 'to file.')
                            app.get("/api/getGroup", function(req, res) {
                                fs.readFile('db.txt', 'utf8', function (err, data) {
                                    if (err) {
                                        res.send(err);
                                    } else {
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
    
    // Get all data from groups file for init
    app.get("/api/getAllGroups", function(req, res) {
        fs.readFile('db.txt', 'utf8', function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                //console.log('Passing back all groups: ' + data);
            }
        });
    });
    
    // Get update values and overwrite file with updated values
    app.post("/api/updateGroup", function(req, res) {
        res.send(req.body);
        var userList = { users: [] };
        groupList.groups = req.body;
        jsonUpdated = JSON.stringify(groupList);
        fs.writeFile('db.txt', jsonUpdated, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Updated file with new values:", req.body);
                fs.readFile('users.txt', 'utf8', function(err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        // res.send(data);
                        //console.log("User data:", data)
                        var users = JSON.parse(data);
                        for (let i = 0; i < users.users.length; i++) {
                            let getUsers = users.users[i];
                            if (getUsers.groups !== undefined) {
                                for (let g = 0; g < getUsers.groups.length; g++) {
                                    var updatedUsers = req.body.find(key => key.groupID === getUsers.groups[g].groupID)
                                    getUsers.groups[g] = updatedUsers
                                }
                                userList.users.push(getUsers)
                            } else {
                                userList.users.push(getUsers)
                            }
                        }
                        var updateUserGroups = JSON.stringify(userList);
                        fs.writeFile('users.txt', updateUserGroups, function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Updated user groups.");
                            }
                        });
                    }
                });
            }
        });
    });
    
    // Get object to delete and delete it from Groups file
    app.post("/api/deleteGroup", function (req, res) {
        res.send(req.body);
        var userList = { users: [] };
        fs.readFile('db.txt', 'utf8', function (err, data) {
            if (err) {
                res.send(err);
            } else {
                groupList = JSON.parse(data);
                var selectedGroup = req.body;
                indexToDelete = groupList.groups.findIndex(x => x.groupName === selectedGroup.groupName);
                groupList.groups.splice(indexToDelete, 1);
                json = JSON.stringify(groupList);
                fs.readFile('users.txt', 'utf8', function(err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        // res.send(data);
                        //console.log("User data:", data)
                        var users = JSON.parse(data);
                        for (let i = 0; i < users.users.length; i++) {
                            let getUsers = users.users[i];
                            if (getUsers.groups !== undefined) {
                                for (let g = 0; g < getUsers.groups.length; g++) {
                                    if (getUsers.groups[g].groupID === selectedGroup.groupID) {
                                        groupIndexToDelete = getUsers.groups.findIndex(idx => idx.groupID === selectedGroup.groupID)
                                        getUsers.groups.splice(groupIndexToDelete, 1)
                                    }
                                }
                                userList.users.push(getUsers)
                            } else {
                                userList.users.push(getUsers)
                            }
                        }
                        var updateUserGroups = JSON.stringify(userList);
                        fs.writeFile('users.txt', updateUserGroups, function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Updated user groups.");
                            }
                        });
                    }
                });
                fs.writeFile('db.txt', json, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Deleted " + selectedGroup.groupName + " from groups file.");
                        
                    }
                });
            }
        });
    });
}