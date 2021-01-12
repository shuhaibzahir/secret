//jshint esversion:6
require('dotenv-extended').load();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const alert = require("alert");
const encrypt = require('mongoose-encryption');
const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true,  useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
  email:String,
  password : String
});


userSchema.plugin(encrypt, {secret:process.env.SECRET,   encryptedFields:["password"]});
const UserData = mongoose.model('User', userSchema);

app.get('/', function(req, res){
  res.render('home')
})

app.route("/register")
.get(function(req, res){
  res.render("register")
})
.post(function(req , res){
  const newUser = new UserData({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render('secrets')
    }
  });
})

app.route("/login")
.get( function(req, res){
  res.render('login')
})
.post(function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  UserData.findOne({email:username}, function(err, result){
    if(!err){
      if(result){
        if(result.password === password){
          res.render('secrets')
        }
      }
    }else{
      console.log(err);
    }
  })
})




app.listen(3000, function(){
  console.log("server start at port 3000");
})
