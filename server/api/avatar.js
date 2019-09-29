module.exports = function(db, app, ObjectID, formidable, multipart, fs) {
    const  multipartMiddleware  =  multipart({ uploadDir: '/Users/HPCustomer/3813ICT/Assignment1/ChatApp/src/assets' });
    
    //
    // app.post('/api/uploadAvatar', function(req, res) {
    //     var form = new formidable.IncomingForm();
    //     form.parse(req);
    //     form.on('fileBegin', function(name, file) {
    //         file.path = '/Users/HPCustomer/3813ICT/Assignment1/ChatApp/src/assets/' + file.name;
    //     });

    //     form.on('file', function(name, file) {
    //         console.log('Uploaded ' + file.name);
    //         res.send(file);
    //     });

    // });

    app.post('/api/uploadAvatar', multipartMiddleware, function(req, res) {
        console.log("This is the request", req.files);
        
        res.json({
            'message': 'File uploaded successfully.',
            'img': req.files.uploads[0].originalFilename
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