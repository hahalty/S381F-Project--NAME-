    const assert = require('assert');

    



    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();
    const session = require('cookie-session');
    const SECRETKEY = '381project';

    var usersinfo = new Array(
        {name: "admin", password: "admin"},
        {name: "student", password: "student"},
        {name: "student2", password: "student2"}
    );

    var documents = {};
    //Main Body
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
            console.log("...Not authenticated; directing to dashboard-login");
            res.redirect("/dashboard-login");
        }else{
            res.redirect("/dashboard-login");
        }
        console.log("...Hello, welcome back");
    });

    //login
    app.get('/dashboard-login', function(req, res){
        console.log("...Welcome to dashboard-login page.")
        res.sendFile(__dirname + '/public/dashboard-login.html');
        return res.status(200).render("dashboard-login");
    });

    app.post('/dashboard-login', function(req, res){
        console.log("...Handling your dashboard-login request");
        for (var i=0; i<usersinfo.length; i++){
            if (usersinfo[i].name == req.body.username && usersinfo[i].password == req.body.password) {
            req.session.authenticated = true;
            req.session.userid = usersinfo[i].name;
            console.log(req.session.userid);
            return res.status(200).redirect("/home");
            }
        }
            console.log("Error username or password.");
            return res.redirect("/");
    });

    app.get('/logout', function(req, res){
        req.session = null;
        req.authenticated = false;
        res.redirect('/dashboard-login');
    });

    app.get('/home', function(req, res){
        console.log("...Welcome to the home page!");
        return res.status(200).render("home");
    });






    app.listen(app.listen(process.env.PORT || 5000));
