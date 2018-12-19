var express 		= require("express"),
	app 			= express(),
	bodyParser		= require("body-parser");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/views/landing.html");
});

app.listen(process.env.PORT || 8080, function(){
	console.log("Server online");
});