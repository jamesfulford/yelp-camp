var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var express = require("express");
var app = express();

mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
var Campground = mongoose.model("Campground", campgroundSchema);


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
    Campground.findById( req.params.id, function(err, camp) {
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
