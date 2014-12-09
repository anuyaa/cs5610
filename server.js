//  OpenShift sample Node application
// load web service and database libraries
var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');

//instantiates both libraries and connect to database to cs5610
var app = express();
app.use(express.static(__dirname + '/public'));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));

// parse various different custom JSON types as JSON
app.use(bodyParser.json());

//app.use(bodyParser);

//app.use(app.router);
// mongodbConnectionString is name of database we want to use
var mongodbConnectionString = "mongodb://admin:zJ4i2QSgePT5@127.4.113.2:27017/" + "quizera";
if(typeof process.env.OPENSHIFT_MONGODB_DB_URL == "undefined"){
	mongodbConnectionString = "quizera";
}

console.log("db connection string . "+mongodbConnectionString);
var db = mongojs(mongodbConnectionString,["professor","student","courses"]);

var applications = require('./public/server/sub_server.js');

applications(app, db, mongojs);

app.get("/", function(req, res){
	res.send(" Hello world from open shift application ");
});

app.get("/hello", function(req, res){
	res.send(" Hello world from open shift application ");
});

app.get("/env", function(req, res){
	res.json(process.env);
});

var ipaddress =  process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      =  process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port,ipaddress);


