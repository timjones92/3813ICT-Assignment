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
            // add user to users collection
            chai.request(server).post('/api/addUser').type('form')
            .send(toDeleteGroup)
            
            // DELETE user from users collection
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



});