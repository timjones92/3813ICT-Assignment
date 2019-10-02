let assert = require('assert');
let server = require('../server');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);
//var http = require('http');

describe('Server test', function() {
    // The function passed to before() is called before running the test cases.
    before(function() {console.log("before test");});
    // The function passed to after() is called after running the test cases.
    after(function() {console.log("after test");});

    // --------------------------------------------------------------------------------------------
    // ---------------------------- Integration test cases for users ----------------------------
    // --------------------------------------------------------------------------------------------
    describe('/UsersTests', () => {
        // User Test Case #1 - get all users
        it('should GET all users', (done) => {
            chai.request(server)
                .get('/api/allUsersList')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
        // User Test Case #2 - add new user
        it('it should insert a new user, and db should return array with new user in it', (done) => {
            let newUser = {
                'username': 'Thor Odinson', 
                'password': 'password', 
                'email': 'thor@asgard.com', 
                'role': 'User',
                'avatar': '../assets/default-avatar.jpg'
            }
            chai.request(server).post('/api/addUser').type('form')
            .send(newUser)
            .end((err, res) => {
                res.should.have.status(200);
                for (let i in res.body.length) {
                    res.body[i].should.include(newUser);
                }
                done();
            });
        });

        // User Test Case #3 - update all users
        it('it should update an array of users, and db should return array with updated users in it', (done) => {
            let updatedUsers = [{
                '_id': '5knon2ion32i',
                'username': 'Thor Odinson', 
                'password': 'ThorRules', 
                'email': 'thor@asgard.com', 
                'role': 'GroupAdmin',
                'avatar': '/uploads/thor.jpg'
            }]
            chai.request(server)
            .post('/api/updateUsers')
            .send(updatedUsers)
            .end((err, res) => {
                res.should.have.status(200);
                for (let i in res.body.length) {
                    res.body[i].should.include(updatedUsers[0]);
                }
                done();
            });
        });

        // User Test Case #4 - delete a user
        it('it should delete a user, and db should return array without deleted user in it', (done) => {
            let toDeleteUser = {
                '_id': '5knon2ion32i',
                'username': 'Thor Odinson', 
                'password': 'ThorRules', 
                'email': 'thor@asgard.com', 
                'role': 'GroupAdmin',
                'avatar': '/uploads/thor.jpg'
            }
            // add user to users collection
            chai.request(server).post('/api/addUser').type('form')
            .send(toDeleteUser)
            
            // DELETE user from users collection
            chai.request(server)
            .post('/api/deleteUser')
            .send(toDeleteUser._id)
            .end((err, res) => {
                res.should.have.status(200);
                for (let i in res.body.length) {
                    res.body[i].should.not.include(toDeleteUser);
                }
                done();
            });
        });

    });

    // --------------------------------------------------------------------------------------------
    // ----------------------- Integration test cases for groups -----------------------
    // --------------------------------------------------------------------------------------------
    describe('/GroupsTests', () => {
        // Group Test Case #1 - get all groups
        it('should GET all groups', (done) => {
            chai.request(server)
                .get('/api/allGroupsList')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
        // Group Test Case #2 - add new group
        it('it should insert a new user, and db should return array with new user in it', (done) => {
            let newGroup = {
                'groupID': 1, 
                'groupName': 'Mi-Goreng'
            }
            chai.request(server).post('/api/addGroup').type('form')
            .send(newGroup)
            .end((err, res) => {
                res.should.have.status(200);
                for (let i in res.body.length) {
                    res.body[i].should.include(newGroup);
                }
                done();
            });
        });

        // Group Test Case #3 - update all groups
        it('it should update an array of users, and db should return array with updated users in it', (done) => {
            let updatedGroups = [{
                'groupID': 1, 
                'groupName': 'Mi-Goreng Low Salt'
            }]
            chai.request(server)
            .post('/api/updateGroups')
            .send(updatedGroups)
            .end((err, res) => {
                res.should.have.status(200);
                for (let i in res.body.length) {
                    res.body[i].should.include(updatedGroups[0]);
                }
                done();
            });
        });

        // Group Test Case #4 - delete a group
        it('it should delete a user, and db should return array without deleted user in it', (done) => {
            let toDeleteGroup = {
                '_id': '823484ijoasj',
                'groupID': 1, 
                'groupName': 'Mi-Goreng'
            }
            // add group to groups collection
            chai.request(server).post('/api/addGroup').type('form')
            .send(toDeleteGroup)
            
            // DELETE group from groups collection
            chai.request(server)
            .post('/api/deleteGroup')
            .send(toDeleteGroup._id)
            .end((err, res) => {
                res.should.have.status(200);
                for (let i in res.body.length) {
                    res.body[i].should.not.include(toDeleteGroup);
                }
                done();
            });
        });

    });

    // --------------------------------------------------------------------------------------------
    // ----------------------- Integration test cases for channels -----------------------
    // --------------------------------------------------------------------------------------------
    describe('/ChannelsTests', () => {
        // Group Test Case #1 - get all channels
        it('should GET all channels', (done) => {
            chai.request(server)
                .get('/api/allChannelsList')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
        // Group Test Case #2 - add new channel
        it('it should insert a new channel, and db should return array with new channel in it', (done) => {
            let newChannel = {
                'groupID': 1, 
                'groupName': 'Mi-Goreng',
                'channelID': 1,
                'channelName': 'Chicken'
            }
            chai.request(server).post('/api/addChannel').type('form')
            .send(newChannel)
            .end((err, res) => {
                res.should.have.status(200);
                for (let i in res.body.length) {
                    res.body[i].should.include(newChannel);
                }
                done();
            });
        });

        // Group Test Case #3 - update all channels
        it('it should update an array of channels, and db should return array with updated channels in it', (done) => {
            let updatedChannels = [{
                'groupID': 1, 
                'groupName': 'Mi-Goreng',
                'channelID': 1,
                'channelName': 'Chicken ftw'
            }]
            chai.request(server)
            .post('/api/updateChannels')
            .send(updatedChannels)
            .end((err, res) => {
                res.should.have.status(200);
                for (let i in res.body.length) {
                    res.body[i].should.include(updatedChannels[0]);
                }
                done();
            });
        });

        // Group Test Case #4 - delete a channel
        it('it should delete a channel, and db should return array without deleted channel in it', (done) => {
            let toDeleteChannel = {
                '_id': '9389u4ijoasj',
                'groupID': 1, 
                'groupName': 'Mi-Goreng',
                'channelID': 1,
                'channelName': 'Chicken ftw'
            }
            // add channel to channels collection
            chai.request(server).post('/api/addChannel').type('form')
            .send(toDeleteChannel)
            
            // DELETE channel from channels collection
            chai.request(server)
            .post('/api/deleteChannel')
            .send(toDeleteChannel._id)
            .end((err, res) => {
                res.should.have.status(200);
                for (let i in res.body.length) {
                    res.body[i].should.not.include(toDeleteChannel);
                }
                done();
            });
        });

    });

    // --------------------------------------------------------------------------------------------
    // ----------------------- Integration test cases for group users -----------------------
    // --------------------------------------------------------------------------------------------
    describe('/UserGroupsTests', () => {
        // UserGroups Test Case #1 - get all group users
        it('should GET all group users', (done) => {
            chai.request(server)
                .get('/api/allGroupUsersList')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        // UserGroups Test Case #2 - add new group user
        it('it should insert a new group user, and db should return array with new group user in it', (done) => {
            let group = {
                'groupID': 1, 
                'groupName': 'Mi-Goreng',
            }
            let user = {
                '_id': '98fs38fh732f',
                'username': 'Mi Goreng Monster'
            }
            
            chai.request(server).post('/api/addUserToGroup').type('form')
            .send({'group': group, 'user': user})
            .end((err, res) => {
                res.should.have.status(200);
                for (let i in res.body.length) {
                    res.body[i].should.include({groupID: group.groupID, userID: user._id});
                }
                done();
            });
        });

        // UserGroups Test Case #3 - delete a group user
        it('it should delete a group user, and db should return array without deleted group user in it', (done) => {
            let group = {
                'groupID': 1, 
                'groupName': 'Mi-Goreng',
            }
            let user = {
                '_id': '98fs38fh732f',
                'username': 'Mi Goreng Monster'
            }
            // add group user to usergroups collection
            chai.request(server).post('/api/addUserToGroup').type('form')
            .send({'group': group, 'user': user})
            
            // DELETE group user from usergroups collection
            chai.request(server)
            .post('/api/deleteUserFromGroup')
            .send({'group': group, 'user': user})
            .end((err, res) => {
                // res.should.have.status(200);
                for (let i in res.body.length) {
                    res.body[i].should.not.include({groupID: group.groupID, userID: user._id});
                }
                done();
            });
        });

    });

    // --------------------------------------------------------------------------------------------
    // ----------------------- Integration test cases for channel users -----------------------
    // --------------------------------------------------------------------------------------------
    describe('/UserChannelsTests', () => {
        // UserChannels Test Case #1 - get all channel users
        it('should GET all channel users', (done) => {
            chai.request(server)
                .get('/api/allChannelUsersList')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        // UserChannels Test Case #2 - add new channel user
        it('it should insert a new channel user, and db should return array with new channel user in it', (done) => {
            let group = {
                'groupID': 1, 
                'groupName': 'Mi-Goreng',
            }
            let channel = {
                'channelID': 1,
                'channelName': 'Popo'
            }
            let user = {
                '_id': '98fs38fh732f',
                'username': 'Mi Goreng Monster'
            }
            
            chai.request(server).post('/api/addUserToChannel').type('form')
            .send({'group': group, 'user': user, 'channel': channel})
            .end((err, res) => {
                res.should.have.status(200);
                for (let i in res.body.length) {
                    res.body[i].should.include({groupID: group.groupID, channelID: channel.channelID, userID: user.userID});
                }
                done();
            });
        });

        // UserChannels Test Case #3 - delete a channel user
        it('it should delete a channel user, and db should return array without deleted channel user in it', (done) => {
            let group = {
                'groupID': 1, 
                'groupName': 'Mi-Goreng',
            }
            let channel = {
                'channelID': 1,
                'channelName': 'Popo'
            }
            let user = {
                '_id': '98fs38fh732f',
                'username': 'Mi Goreng Monster'
            }
            // add channel user to userchannels collection
            chai.request(server).post('/api/addUserToChannel').type('form')
            .send({'group': group, 'user': user, 'channel': channel})
            
            // DELETE channel user from userchannels collection
            chai.request(server)
            .post('/api/deleteUserFromChannel')
            .send({'group': group, 'user': user, 'channel': channel})
            .end((err, res) => {
                // res.should.have.status(200);
                for (let i in res.body.length) {
                    res.body[i].should.not.include({groupID: group.groupID, channelID: channel.channelID, userID: user.userID});
                }
                done();
            });
        });

    });

});