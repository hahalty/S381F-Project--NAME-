const assert = require('assert');


const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('cookie-session');
const SECRETKEY = 'cs381';

var usersinfo = new Array(
    {name: "user1", password: "cs381"},
    {name: "user2", password: "cs381"},
    {name: "user3", password: "cs381"}
);

var documents = {};
//Main Body
app.set('view engine', 'ejs');
app.use(session({
    userid: "session",  
    keys: [SECRETKEY],
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const createDocument = function(db, createddocuments, callback){
    const client = new MongoClient(mongourl);
    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected successfully to the MongoDB database server.");
        const db = client.db(dbName);

        db.collection('restaurants').insertOne(createddocuments, function(error, results){
            if(error){
            	throw error
            };
            console.log(results);
            return callback();
        });
    });
}

const findDocument =  function(db, criteria, callback){
    let cursor = db.collection('restaurants').find(criteria);
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray(function(err, docs){
        assert.equal(err, null);
        console.log(`findDocument: ${docs.length}`);
        return callback(docs);
    });
}

const handle_Find = function(res, criteria){
    const client = new MongoClient(mongourl);
    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        findDocument(db, criteria, function(docs){
            client.close();
            console.log("Closed DB connection");
            res.status(200).render('display', {nItems: docs.length, items: docs});
        });
    });
}

const handle_Edit = function(res, criteria) {
    const client = new MongoClient(mongourl);
    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        let documentID = {};
        documentID['_id'] = ObjectID(criteria._id)
        let cursor = db.collection('restaurants').find(documentID);
        cursor.toArray(function(err,docs) {
            client.close();
            assert.equal(err,null);
            res.status(200).render('edit',{item: docs[0]});

        });
    });
}

const handle_Details = function(res, criteria) {
    const client = new MongoClient(mongourl);
    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        let documentID = {};
        documentID['_id'] = ObjectID(criteria._id)
        findDocument(db, documentID, function(docs){ 
            client.close();
            console.log("Closed DB connection");
            res.status(200).render('details', {item: docs[0]});
        });
    });
}

const updateDocument = function(criteria, updatedocument, callback){
    const client = new MongoClient(mongourl);
    client.connect(function(err){
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        console.log(criteria);
	console.log(updatedocument);
	
        db.collection('restaurants').updateOne(criteria,{
                $set: updatedocument
            }, function(err, results){
                client.close();
                assert.equal(err, null);
                return callback(results);
            }
        );
    });
}

const deleteDocument = function(db, criteria, callback){
console.log(criteria);
	db.collection('restaurants').deleteOne(criteria, function(err, results){
	assert.equal(err, null);
	console.log(results);
	return callback();
	});

};

const handle_Delete = function(res, criteria) {
    const client = new MongoClient(mongourl);
    client.connect(function(err) {
        console.log("Connected successfully to server");
        const db = client.db(dbName);
	
	let deldocument = {};
	
        deldocument["_id"] = ObjectID(criteria._id);
        deldocument["ownerID"] = criteria.owner;
        console.log(deldocument["_id"]);
        console.log(deldocument["ownerID"]);
        
        deleteDocument(db, deldocument, function(results){
            client.close();
            console.log("Closed DB connection");
            res.status(200).render('info', {message: "Document is successfully deleted."});
        })     
    });
    //client.close();
    //res.status(200).render('info', {message: "Document is successfully deleted."});
}

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


