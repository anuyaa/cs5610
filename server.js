//  OpenShift sample Node application
var express = require('express');

//instantiates both libraries and connect to database to cs5610
var app = express();

app.get("/hello", function(req, res){
	res.send("Hello world from open shift application ");
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;


app.listen(port,ipaddress);