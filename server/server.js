const serverPort = process.env.PORT || 8081;

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dbURL = "mongodb://localhost:27017/";
const server = require('http').Server(app);
const cors = require('cors');
const io = require('socket.io')(server);
const MongoClient = require('mongodb').MongoClient;
const dbName = "ChatAppDB";
const dbCollectionUserDetails = "users";
const dbCollectionChatRecords = "chatHistory";

server.listen(serverPort, () => console.log('Application is listening on port: ' + serverPort + '!'));

app.use(bodyParser.json());
app.use(cors());
app.post('/signIn', (req, res) => {
    var email = req.body.email;
    var pwd = req.body.pwd;
    MongoClient.connect(dbURL, function(err, db) {
        if (err) {
            db.close();
            throw err;
        }
        var dbo = db.db(dbName);
        var myobj = { email: email, password: pwd };
        dbo.collection(dbCollectionUserDetails).findOne({email: email}, function(err, result) {
            if (err) {
                db.close();
                throw err;
            }
            if (result) {
                if (result.password == pwd) {
                    db.close();
                    res.send({
                        msg: "success"
                    })
                } 
                else {
                    db.close();
                    res.send({
                        msg: "invalid"
                    })
                }
            }
            else {
                db.close();
                res.send({
                    msg: "no data could be fetched"
                })
            }
        });
    });
})
io.on('connection', function (socket) {

    socket.on('fromClient', function (data) {
        var vToUser = data.userTo;
        var vFromUser = data.userFrom;
        var vMsg = data.msg;
        var vDate = new Date();
        MongoClient.connect(dbURL, function(err, db) {
            if (err) {
                db.close();
                throw err;
            }
            var dbo = db.db(dbName);
            var myobj = { From: vFromUser, To: vToUser, Message: vMsg, Date: vDate };
            dbo.collection(dbCollectionChatRecords).insertOne(myobj, function(err, result) {
                if (err) {
                    db.close();
                    throw err;
                }
                if (result) {
                    db.close();
                    io.emit(vToUser, {userTo: vToUser, userFrom: vFromUser, msg: vMsg, date: vDate });
                }
            });
        });
        
    });

    socket.on('disconnect', function () {
        io.emit('user disconnected');
    });

});
app.post('/signUp', (req, res) => {
    var email = req.body.email;
    var pwd = req.body.pwd;
    MongoClient.connect(dbURL, function(err, db) {
        if (err) {
            db.close();
            throw err;
        }
        var dbo = db.db(dbName);
        dbo.collection(dbCollectionUserDetails).findOne({email: email}, function(err, result) {
            if (err) {
                db.close();
                throw err;
            }
            if (result) {
                db.close();
                res.send({
                    msg: "found"
                })
            }
            else {
                var myobj = { email: email, password: pwd };
                dbo.collection(dbCollectionUserDetails).insertOne(myobj, function(err, result) {
                    if (err) {
                        db.close();
                        throw err;
                    }
                    db.close();
                    res.send({
                        msg: "success"
                    })
                });
            }
        });
    });    
})
app.post('/getUserList', (req, res) => {
    var vUserId = req.body.userId;
    

    MongoClient.connect(dbURL, function(err, db) {
        if (err) {
            db.close();
            throw err;
        }
        var dbo = db.db(dbName);
        var vWhere = { email: {$nin:[vUserId]} };
        var vSort = { email: 1 };
        var vSelect = { _id: 0, email: 1 }
        dbo.collection(dbCollectionUserDetails).find(vWhere).sort(vSort).project(vSelect).toArray(function(err, result) {
            if (err) {
                db.close();
                throw err;
            }
           
            db.close();
            res.send({
                msg: "success",
                userList: result
            })
        });
    });    
})

app.post('/getLastMsgs', (req, res) => {
    var vUserId = req.body.userId;
    var vLimit = req.body.limit;

    MongoClient.connect(dbURL, function(err, db) {
        if (err) {
            db.close();
            throw err;
        }
        var dbo = db.db(dbName);
        var vWhere = {
            $or:[
              {From: vUserId},
              {To: vUserId}
            ]
        };
        var vSort = {date: 1};
        dbo.collection(dbCollectionChatRecords).find(vWhere).sort(vSort).limit(vLimit).toArray(function(err, result) {
            if (err) {
                db.close();
                throw err;
            }
            
            db.close();
            res.send({
                msg: "success",
                history: result
            })
        });
    });    
})

app.post('/getTodayChat', (req, res) => {
    var vUserId = req.body.userId;
    var vUserFor = req.body.userFor;
    MongoClient.connect(dbURL, function(err, db) {
        if (err) {
            db.close();
            throw err;
        }
        var dbo = db.db(dbName);
        var vWhere = {
            $or:[
              {From: vUserId, To: vUserFor},
              {From: vUserFor, To: vUserId}
            ]
        };
        var vSort = {date: 1};
        dbo.collection(dbCollectionChatRecords).find(vWhere).sort(vSort).toArray(function(err, result) {
            if (err) {
                db.close();
                throw err;
            }
            db.close();
            res.send({
                msg: "success",
                todayChat: result
            })
        });
    });    
})