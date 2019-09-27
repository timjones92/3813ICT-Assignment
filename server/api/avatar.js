module.exports = function(db, app, formidable) {
    //
    app.post('/api/uploadAvatar', function(req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req);
        form.on('fileBegin', function(name, file) {
            file.path = __dirname + '/uploads/' + file.name;
        });

        form.on('file', function(name, file) {
            console.log('Uploaded ' + file.name);
            res.send(JSON.stringify('api/uploads/' + file.name));
        });

        
    });
}