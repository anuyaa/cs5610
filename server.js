//  OpenShift sample Node application
// load web service and database libraries
var express = require('express');
var mongojs = require('mongojs')

//instantiates both libraries and connect to database to cs5610
var app = express();

var mongodbConnectionString = process.env.OPENSHIFT_MONGODB_DB_URL + "cs5610DB"
if(typeof process.env.OPENSHIFT_MONGODB_DB_URL == "undefined"){
	mongodbConnectionString = "cs5610DB";
}
var db = mongojs(mongodbConnectionString,["student","professor"]);
//app.use(express.static(_dirname+'/public'));

app.get("/hello", function(req, res){
	res.send("Hello world from open shift application ");
});

app.get("/env", function(req, res){
	res.json(process.env);
});



var ipaddress =  process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      =  process.env.OPENSHIFT_NODEJS_PORT || 3000;


app.listen(port,ipaddress);