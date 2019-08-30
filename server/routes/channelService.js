module.exports = function(app, fs) {
    var channelList = { channels: [] };
    
    // Read current channels on file, get incoming new channel, save new channel to file
    app.post("/api/saveChannel", (req, res) => {
        fs.readFile('channels.txt', 'utf8', function(err, data) {
            if (err) {
                console.log(err);
            } else {
                //console.log("Data from file initial: " + data);
                res.send(req.body);
                if (data.length !== 0) {
                    channelList = JSON.parse(data);
                    //console.log("Channel list from file is: " + channelList)
                    //console.log("Req body equals: " + JSON.stringify(req.body))
                    channelList.channels.push(req.body);
                    var json = JSON.stringify(channelList);
                    console.log('This is the new group from modal: ' + req.body.channelName);
                    
                    fs.writeFile('channels.txt', json, 'utf8', function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Added', req.body.channelName, 'to file.')
                            app.get("/api/getChannel", function(req, res) {
                                fs.readFile('channels.txt', 'utf8', function (err, data) {
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
    app.get("/api/getAllChannels", function(req, res) {
        fs.readFile('channels.txt', 'utf8', function (err, data) {
            if (err) {
                res.send(err);
            } else {
                if (data.length === 0) {
                    startChannelList = JSON.stringify(channelList)
                    fs.writeFile('channels.txt', startChannelList, 'utf8', function (err, data) {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log("Started new list of channels.")
                        }
                    });
                }
                res.send(data);
                //console.log('Passing back all channels: ' + data);
            }
        });
    });

    // Get update values and overwrite file with updated values
    app.post("/api/updateChannels", function(req, res) {
        res.send(req.body);
        var userList = { users: [] };
        channelList.channels = req.body;
        jsonUpdated = JSON.stringify(channelList);
        fs.writeFile('channels.txt', jsonUpdated, function(err) {
            if (err) {
                console.log(err);
            } else {
                //console.log("Updated file with new values:", req.body);
                fs.readFile('users.txt', 'utf8', function(err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        // res.send(data);
                        //console.log("User data:", data)
                        var users = JSON.parse(data);
                        for (let i = 0; i < users.users.length; i++) {
                            let getUsers = users.users[i];
                            if (getUsers.channels !== undefined) {
                                for (let g = 0; g < getUsers.channels.length; g++) {
                                    var updatedUsers = req.body.find(key => key.channelID === getUsers.channels[g].channelID)
                                    getUsers.channels[g] = updatedUsers
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
    app.post("/api/deleteChannel", function (req, res) {
        res.send(req.body);
        var userList = { users: [] };
        fs.readFile('channels.txt', 'utf8', function (err, data) {
            if (err) {
                res.send(err);
            } else {
                channelList = JSON.parse(data);
                var selectedChannel = req.body;
                indexToDelete = channelList.channels.findIndex(x => x.channelID === selectedChannel.channelID);
                channelList.channels.splice(indexToDelete, 1);
                json = JSON.stringify(channelList);
                fs.readFile('users.txt', 'utf8', function(err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        // res.send(data);
                        //console.log("User data:", data)
                        var users = JSON.parse(data);
                        for (let i = 0; i < users.users.length; i++) {
                            let getUsers = users.users[i];
                            if (getUsers.channels !== undefined) {
                                for (let g = 0; g < getUsers.channels.length; g++) {
                                    if (getUsers.channels[g].channelID === selectedGroup.channelID) {
                                        channelIndexToDelete = getUsers.channels.findIndex(idx => idx.channelID === selectedGroup.channelID)
                                        getUsers.channels.splice(channelIndexToDelete, 1)
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
                fs.writeFile('channels.txt', json, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Deleted " + selectedChannel.channelName + " from groups file.");
                        
                    }
                });
            }
        });
    });

    // Add a new user to an existing channel
    app.post("/api/addUserToChannel", function(req, res) {
        res.send(req.body);
        var groupNameToAdd = req.body.groupName;
        var groupIDToAdd = req.body.groupID;
        var channelIdToAdd = req.body.channelID;
        var channelNameToAdd = req.body.channelName;
        var user = req.body.user;
        fs.readFile('users.txt', 'utf8', function(err, data) {
            if (err) {
                res.send(err);
            } else {
                userList = JSON.parse(data);
                var indexOfUser = userList.users.findIndex(u => u.username === user);
                var updatedUser = userList.users[indexOfUser]
                //console.log(updatedUser)
                if (updatedUser.channels === undefined) {
                    updatedUser.channels = []
                }
                updatedUser.channels.push(
                    {
                        "groupID": groupIDToAdd,
                        "groupName": groupNameToAdd,
                        "channelID": channelIdToAdd,
                        "channelName": channelNameToAdd
                    }
                );
                jsonToFile = JSON.stringify(userList);
                fs.writeFile('users.txt', jsonToFile, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Added", user, "to group", channelNameToAdd);
                    }
                });
            }
        })
    });

    // Delete an existing user from a channel
    app.post("/api/deleteUserFromChannel", function(req, res) {
        res.send(req.body);
        var channelNameToDelete = req.body.channelName;
        var channelIDToDelete = req.body.channelID;
        var user = req.body.user;
        fs.readFile('users.txt', 'utf8', function(err, data) {
            if (err) {
                res.send(err);
            } else {
                userList = JSON.parse(data);
                var indexOfUser = userList.users.findIndex(u => u.username === user);
                var currentUser = userList.users[indexOfUser]
                //console.log(currentUser)
                for (let i = 0; i < currentUser.channels.length; i ++) {
                    if (currentUser.channels[i].channelID === channelIDToDelete) {
                        currentUserChannelIndex = currentUser.channels.findIndex(g => g.channelID === channelIDToDelete);
                        currentUser.channels.splice(currentUserChannelIndex, 1);
                    }
                }
                console.log(currentUser)
                jsonToFile = JSON.stringify(userList);
                fs.writeFile('users.txt', jsonToFile, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Deleted", user, "from channel:", channelNameToDelete);
                    }
                });
            }
        })
    });
}