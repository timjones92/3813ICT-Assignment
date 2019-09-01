module.exports = function(app, path) {
    app.get('/channel/{id}', function(req,res) {
        let filepath = path.resolve('../src/app/channel/channel.component.html');
        res.sendFile(filepath);
    });

}