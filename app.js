//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app =express();
console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser: true});
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ["password"]} );

const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser=new User({
        email: req.body.username,
        password: req.body.password
    });
    // newUser.save(function(err,result){
    //     if (err){
    //         console.log(err);
    //     }else{
    //         res.render("secrets");
    //     }
        

    // });

    newUser.save()
    .then(result=>{
        res.render("secrets");
    })
    .catch(err=>{
        console.log(err);
    });
});

app.post("/login", async function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    const foundUser=await User.findOne({email:username}).exec();//, function(err,foundUser){
        // if(err){
        //     console.log(err);
        // }else{
        //     if(foundUser){
        //         if(foundUser.password=== password){
        //             res.render("secrets");
        //         }
        //     }
        // }
        
            if(foundUser){
                if(foundUser.password=== password){
                     res.render("secrets");
               }
            }else{
            console.log(err);
            }
    });

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
