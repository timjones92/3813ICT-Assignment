module.exports = function(app, path) {
    app.get('/', function(req,res) {
        let filepath = path.resolve('../src/app/login/login.component.html');
        res.sendFile(filepath);
    });

}