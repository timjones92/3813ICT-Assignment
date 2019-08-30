module.exports = function(app, fs) {
    var groupList = { groups: [] };

    // Read current groups on file, get incoming new group, save group to file
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
                if (data.length === 0) {
                    startGroupList = JSON.stringify(groupList)
                    fs.writeFile('db.txt', startGroupList, 'utf8', function (err, data) {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log("Started new list of groups.")
                        }
                    });
                }
                res.send(data);
                //console.log('Passing back all groups: ' + data);
            }
        });
    });
    
    // Get update values and overwrite file with updated values
    app.post("/api/updateGroup", function(req, res) {
        res.send(req.body);
        var userList = { users: [] };
        var channelList = { channels: [] };
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
                                    var updatedUserGroups = req.body.find(key => key.groupID === getUsers.groups[g].groupID)
                                    getUsers.groups[g] = updatedUserGroups
                                }
                                userList.users.push(getUsers);
                            } else {
                                userList.users.push(getUsers);
                            }
                        }
                        //console.log(userList)
                        fs.readFile('channels.txt', 'utf8', function(err, data) {
                            if (err) {
                                res.send(err);
                            } else {
                                let allChannels = JSON.parse(data);
                                for (let i = 0; i < allChannels.channels.length; i++) {
                                    let getChannel = allChannels.channels[i];
                                    if (req.body.find(key => key.groupName === getChannel.groupName) === undefined) {
                                        let unchangedChannels = req.body.find(key => key.groupID === getChannel.groupID);
                                        getChannel.groupID = unchangedChannels.groupID;
                                        getChannel.groupName = unchangedChannels.groupName;
                                        channelList.channels.push(getChannel);
                                    } else {
                                        channelList.channels.push(getChannel)
                                    }
                                }
                                //console.log(channelList.channels)
                                var updatedUserChannelGroups = JSON.stringify(channelList);
                                for (let i = 0; i < users.users.length; i++) {
                                    let use = userList.users[i];
                                    if (use.channels !== undefined) {
                                        for (let cha = 0; cha < use.channels.length; cha++) {
                                            use.channels[cha] = channelList.channels.find(ch => ch.channelID === use.channels[cha].channelID)
                                        }
                                    }
                                }
                                console.log(userList);
                                var updateUserGroups = JSON.stringify(userList);
                                fs.writeFile('users.txt', updateUserGroups, function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log("Updated user groups.");
                                    }
                                });
                                fs.writeFile('channels.txt', updatedUserChannelGroups, function(err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log("Updated user channel groups.");
                                    }
                                });
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
        var channelList = { channels: [] };
        fs.readFile('db.txt', 'utf8', function (err, data) {
            if (err) {
                res.send(err);
            } else {
                groupList = JSON.parse(data);
                let selectedGroup = req.body;
                indexToDelete = groupList.groups.findIndex(x => x.groupName === selectedGroup.groupName);
                groupList.groups.splice(indexToDelete, 1);
                let json = JSON.stringify(groupList);
                fs.writeFile('db.txt', json, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Deleted " + selectedGroup.groupName + " from groups file.");
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
                                                getUsers.groups.splice(groupIndexToDelete, 1);
                                            }
                                        }
                                        userList.users.push(getUsers);
                                    } else {
                                        userList.users.push(getUsers);
                                    }
                                }
                                fs.readFile('channels.txt', 'utf8', function(err, data) {
                                    if (err) {
                                        res.send(err);
                                    } else {
                                        let existingChannels = JSON.parse(data);
                                        if (existingChannels.channels !== undefined) {
                                            for (let i = 0; i < existingChannels.channels.length; i++) {
                                                let eachChannel = existingChannels.channels[i];
                                                if (eachChannel.groupID === selectedGroup.groupID) {
                                                    let deleteIndex = existingChannels.channels.indexOf(eachChannel)
                                                    existingChannels.channels.splice(deleteIndex, 1);
                                                    channelList.channels.push(eachChannel);
                                                }
                                            }
                                            
                                        }
                                        
                                        let jsonUpdatedChannels = JSON.stringify(channelList);
                                        console.log(jsonUpdatedChannels)
                                        for (let i = 0; i < users.users.length; i++) {
                                            let use = userList.users[i];
                                            if (use.channels !== undefined) {
                                                for (let cha = 0; cha < use.channels.length; cha++) {
                                                    let idx = use.channels.findIndex(i => i.groupID === selectedGroup.groupID);
                                                    use.channels.splice(idx, 1);
                                                }
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
                                        fs.writeFile('channels.txt', jsonUpdatedChannels, function(err) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                console.log(
                                                    "Deleting group", selectedGroup.groupName, 
                                                    "caused it's channels to be deleted."
                                                );
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
                
            }
        });
    });
}