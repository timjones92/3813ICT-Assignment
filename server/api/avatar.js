module.exports = function(db, app, ObjectID, formidable, multipart) {
    const  multipartMiddleware = multipart({ uploadDir: __dirname + '/uploads'});

    app.post('/api/uploadImage', multipartMiddleware, function(req, res) {
        res.json({
            'message': 'File uploaded successfully.',
            'img': req.files.uploads[0].path
        });
    });
    
    app.post('/api/updateUserAvatar', function(req,res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        user = req.body.user;
        img = req.body.img;
        // Create new object id from current user id
        var objectid = new ObjectID(user._id)
        // Access db's for users and chats to update avatars
        const usercollection = db.collection('users');
        const chatcollection = db.collection('chats');
        // Update user's avatar in users collection
        usercollection.updateOne({_id: objectid}, {$set:{avatar: img}});
        // Update all avatars for user in chats collection
        chatcollection.updateMany({userID: user._id}, {$set:{userimg: img}});
        // Send success message
        res.send({success: "Updated current user avatar"});
    });
}