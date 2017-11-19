var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var express = require("express");
var app = express();

mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});
var Campground = mongoose.model("Campground", campgroundSchema);


app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if(err) {
            res.send("Error: " + err);
        } else {
            res.render("campgrounds", {campgrounds: campgrounds});
        }
    });
});
app.post("/campgrounds", function(req, res) {
    Campground.create(
        req.body,
        function(err, campground) {
            if(err){
                console.log(err);
                res.send("Error: " + err);
            } else {
                res.redirect("/campgrounds");
            }
        }
    );
});
app.get("/campgrounds/new", function(req, res) {
    res.render("newcamp");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Yelp-Camp server started.");
});
