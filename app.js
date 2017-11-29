// Dependencies
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var express = require("express");

// Models
var Campground = require("./models/campground");
var Comment = require("./models/comment");

//
// Configure
//

var app = express();
mongoose.connect("mongodb://localhost/yelpcamp", { useMongoClient: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//
// Pre-server
//

var seedDB = require("./seeds");
seedDB();


//
// Routes
//

app.get("/", function(req, res) {
    res.render("landing");
});

//
// Campgrounds
//

// INDEX
app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if(err) {
            console.log(err);
            res.send("Error: " + err);
        } else {
            res.render("index.ejs", {campgrounds: campgrounds});
        }
    });
});

// NEW
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});
// CREATE
app.post("/campgrounds", function(req, res) {
    // Add to database, redirect to campgrounds
    Campground.create(req.body,
        function(err, campground) {
            if(err){
                console.log(err);
                res.send("Error: " + err);
            } else {
                // redirect on success
                res.redirect("/campgrounds");
            }
        }
    );
});

// SHOW
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, camp) {
        if(err) {
            console.log(err);
            res.send("Error: " + err);
        } else {
            res.render("show", {camp: camp});    
        }
    });
});


//
// Serving
//
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Yelp-Camp server started.");
});
