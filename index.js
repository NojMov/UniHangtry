const express = require('express');
const mysql = require("mysql");
const ejs = require("ejs");

//express app
const app = new express();


//database connection config
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'unihangDb',
});

// //connection with the DB
db.connect((err) => {
    if (err) {
        throw err;
    }else{
        console.log(`Successfully connected to the DB`)
    }
})

// Initialize Body Parser Middleware to parse data sent by users in the request object
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse HTML form data

// Initialize ejs Middleware
app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));


//home route
app.get("/", (req, res) => {
    res.render("../views/home.ejs");
});

 
//creation routes
app.post("/createorg", (req, res) => {
    let data = { oname: req.body.orgname, odetails: req.body.details };
    let sql = `INSERT INTO orgs SET ?`;
    let query = db.query(sql, data, (err, result) => {
      if (err) {
        throw err;
      }
      res.send(`Org has been created`);
    });
  });

app.post("/createevent", (req, res) => {
    let e1 = { ename: req.body.evname, edetails: req.body.evdetails, edate: req.body.thedate };
    let sql = `INSERT INTO e SET ?`;
    let query = db.query(sql, e1, (err, result) => {
        if (err) {
            throw err;
            
        }
        res.send(`Event has been created`)
        console.log("it worked");
    });
});

//update routes
app.post("/updateorgs", (req, res) => {
    let sql = `UPDATE orgs SET odetails = '${req.body.updateOrgDetails}' WHERE id = ${req.body.orgId}`;
    db.query(sql, (err, result) => {
        if (err){
            throw err;
        }
        res.send(`updated org`);
    });
});

app.post("/updateevent", (req, res) => {
    let sql = `UPDATE e SET edetails = '${req.body.updateEDetails}' WHERE id = ${req.body.eventId}`;
    let sql2 = `UPDATE e SET edate = ${req.body.updateEDate} WHERE id = ${req.body.eventId}`;
    db.query(sql, sql2, (err, result) => {
        if (err){
            throw err;
        }
        res.send(`updated event`);
    });
});

//delete routes
app.post("/deleteorg", (req, res) => {
    let sql = `DELETE FROM orgs WHERE id = '${req.body.orgIdent}'`;
    db.query(sql, (err, result) => {
        if (err){
            throw err;
        }
        res.send(`Org deleted`);
    });
});

app.post("/deleteevent", (req, res) => {
    let sql = `DELETE FROM e WHERE id = '${req.body.eIdent}'`;
    db.query(sql, (err, result) => {
        if (err){
            throw err;
        }
        res.send(`Event deleted`);
    });
});

//read routes
app.get("/readevents", (req, res) => {
    let sql = `SELECT * FROM e`;
    db.query(sql, (err, result) => {
        if(err){
            throw err;
        }
        res.render("events", {e1: result})
    });

});

app.get("/readorgs", (req, res) => {
    let sql = `SELECT * FROM orgs`;
    db.query(sql, (err, result) => {
        if(err){
            throw err;
        }
        res.render("orgs", {data: result})
    });

});

//start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> (console.log(`Server started on PORT NO. ${PORT}`)));