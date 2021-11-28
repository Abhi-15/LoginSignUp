//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

const secret = process.env.SECRET;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
	email: String,
	password: String 
});

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
	res.render("home");
});

app.get("/login", function(req, res){
	res.render("login");
});

app.get("/register", function(req, res){
	res.render("register");
});

app.post("/login", function(req, res){

	const username = req.body.username;
	const password = req.body.password;

	User.findOne({email: username}, function(err, foundUser){
		if(err){
			console.log(err);
		}
		else{
			if(foundUser){
				if(foundUser.password === password){
					res.render("secrets");
				}
			}
			else{
				console.log("No user found!!");
			}
		}
	});

});

app.post("/register", function(req, res){
	const email = req.body.username;
	const password = req.body.password;

	const newUser = new User({
		email: email,
		password: password
	});

	newUser.save(function(err){
		if(err){
			console.log(err);
		}
		else{
			res.render("secrets");
		}
	});

});


app.listen(process.env.PORT || 3000, function(){
	console.log("Server started on port 3000");
});