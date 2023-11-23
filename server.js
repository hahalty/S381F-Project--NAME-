    const assert = require('assert');
    const mongoose  = require('mongoose');
    const UserSchma = new mongoose.Schema({
            name : String,
            quantity : Number,
            price :Number})
    const UserModel =mongoose.model("text", UserSchma)

    
    

    const MongoClient = require('mongodb').MongoClient;
    const ObjectID = require('mongodb').ObjectID;

    const mongourl = 'mongodb+srv://admin:admin@cluster0.chetaf4.mongodb.net/'; 
    const dbName = 'test';


    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();
    const session = require('cookie-session');
    const SECRETKEY = '381project';

    var usersinfo = new Array(
        {name: "admin", password: "admin"},
        {name: "ac", password: "pw"},
        {name: "worker", password: "worker"}
    );

    var documents = {};
    //Main Body



    async function connect(){
        try{
            await   mongoose.connect(mongourl);
            console.log("Connected to MongoDB");

        }catch(error){
            console.error(error);

        }
        }


    connect();

































    app.use(express.static('public'));
    
    
    
    app.set('view engine', 'ejs');
    app.use(session({
        userid: "session",  
        keys: [SECRETKEY],
    }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));




    app.get('/', function(req, res){
        if(!req.session.authenticated){
            console.log("...Not authenticated; directing to login");
            res.redirect("/login");
        }else{
            res.redirect("/login");
        }
        console.log("...Hello, welcome back");
    });

    //login
    app.get('/login', function(req, res){
        console.log("...Welcome to login page.")
        res.sendFile(__dirname + '/public/login.html');
        return res.status(200).render("login");
    });

    app.post('/login', function(req, res){
        console.log("...Handling your login request");
        for (var i=0; i<usersinfo.length; i++){
            if (usersinfo[i].name == req.body.username && usersinfo[i].password == req.body.password) {
            req.session.authenticated = true;
            req.session.userid = usersinfo[i].name;
            console.log(req.session.userid);
            return res.status(200).redirect("/home");
            }else {

                



            }
        }
            console.log("Error username or password.");
            return res.redirect("/");
    });
    
    app.get('/logout', function(req, res){
        req.session = null;
        req.authenticated = false;
        res.redirect('/login');
    });

    app.get('/home', function(req, res){
        console.log("...Welcome to the home page!");
        return res.status(200).render("home");
    });
    
    app.get('/create', function(req, res){
        console.log("...Welcome to the create page!");
        return res.status(200).render("create");
    });
    
    app.get('/read', function(req, res){
        console.log("...Welcome to the create page!");
        return res.status(200).render("create");


    });
    
   
    app.get('/update', function(req, res){
        console.log("...Welcome to the update page!");
        return res.status(200).render("update");
    });
    
    app.get('/delete', function(req, res){
        console.log("...Welcome to the delete page!");
        return res.status(200).render("delete");
    });
  

    app.get('/read',(req ,res) =>{
        UserModel.find()
        .then(users => res.json(users))
        .catch(err => res.json(err))




    }
    
    
    
    )


    app.listen(app.listen(process.env.PORT || 5000));   
