var express = require('express');
var bodyParser = require("body-parser");
var app = module.exports = express();


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + '/assets/css/style.css');
});

app.get('/print.css', function(req, res) {
    res.sendFile(__dirname + '/assets/css/print.css');
});

/*
 Gestion du fichier de configuration du router Backbone
 */

app.get('/lib/:folder/:file', function(req, res) {
    res.sendFile(__dirname + '/node_modules/' + req.params.folder + "/" + req.params.file);
});

app.get('/lib/:folder/:folder2/:file', function(req, res) {
    res.sendFile(__dirname + '/node_modules/' + req.params.folder + "/" + req.params.folder2 + "/" + req.params.file);
});

app.get('/:file', function(req, res) {
    res.sendFile(__dirname + '/scripts/' + req.params.file);
});

app.get('/:folder/:file', function(req, res) {
    res.sendFile(__dirname + '/scripts/' + req.params.folder + "/" + req.params.file);
});



/* 
 Home
 */



/*
 API REST pour la gestion des bookmarks cote serveur
 */

//Pour parser les POST
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.listen(3000);
