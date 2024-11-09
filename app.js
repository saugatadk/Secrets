require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");


const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/logout", function(req, res){
    res.render("home");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    async function saveUser(){
        try{
            await newUser.save();
            res.render("secrets");
        }
        catch{
            console.log(err);
        }
    }
    saveUser();
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username})
    .then((foundUser)=>{
        if(foundUser){
           if(foundUser.password === password){
                res.render("secrets");
            }else{
                res.render("login");
            } 
        }else{
            res.render("User NOT FOUND!");
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})



app.listen(3000 || process.env.PORT, function(req, res){
    console.log("Server is up and running at Port 3000.");
});