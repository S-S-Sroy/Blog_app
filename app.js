//Modules installed

var express=require("express");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var bodyParser=require("body-parser");
var expressSanitizer=require("express-sanitizer");

//app config

var app =express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//mongoose model config
mongoose.connect("mongodb://localhost/currency");

var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});

var blog= mongoose.model("blog",blogSchema);
/*
blog.create({
    title:"United States Dollar",
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgOD6B30MbiARMEeRcpwnIpqXGuCENEij5cKUOTm9l19zDAh_EJQ",
    body:"The United States dollar is the official currency of the United States and its territories per the United States Constitution since 1792. In practice, the dollar is divided into 100 smaller cent units, but is occasionally divided into 1000 mills for accounting"
});
*/

//index page

app.get("/",function(req,res){
    res.redirect("/blogs");

});

app.get("/blogs",function(req,res){
    blog.find({},function(err,foundBlog){
        if(err){
            console.log("ERROR!!!");
        }
        else{
            res.render("index.ejs",{blogs:foundBlog});
        }
    });
});

app.get("/blogs/new",function(req,res){
    res.render("new.ejs");
});

app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitizer(req.body.blog.body)
    blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new.ejs"); 
        }
        else{
            res.redirect("/blogs");
        }
    });
});

//show route
app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show.ejs",{blog:foundBlog});
        }
    });
});

//Edit Route

app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit.ejs",{blog:foundBlog});
        }
    });
});

//Update Route

app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitizer(req.body.blog.body)
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateblog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//delete route
app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndDelete(req.params.id,function(err){
        if(err){
           res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.listen(3000,function(){
    console.log("Server!! is ON..");
});