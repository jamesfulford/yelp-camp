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
app.use(express.static(__dirname + "/public"));

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
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});
// NEW
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});
// CREATE
app.post("/campgrounds", function(req, res) {
    // Add to database, redirect to campgrounds
    Campground.create(req.body.campground,
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
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {campground: campground});    
        }
    });
});

//
// Nested Comments Routes
//

// NEW
app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.send("Error: " + err);
        } else {
            res.render("comments/new", { campground: campground });    
        }
    });
});
// CREATE
app.post("/campgrounds/:id/comments", function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                    res.redirect("/campgrounds/" + campground._id);
                } else {
                    campground.comments.push(comment);
                    campground.save(function(err) {
                        if(err) {
                            console.log(err);
                        }
                        res.redirect("/campgrounds/" + req.params.id);
                    });
                }
            });
        }
    });
});


//
// Serving
//
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Yelp-Camp server started.");
});
