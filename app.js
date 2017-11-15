var bodyParser = require("body-parser")
var express = require("express");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


app.get("/", function(req, res) {
    res.render("landing");
});

var campgrounds = [
    { name: "Salmon Creek", image: "http://photosforclass.com/download/36723971224" },
    { name: "Hallowed Lake", image: "http://photosforclass.com/download/37386589826" },
    { name: "Congress Butte", image: "http://photosforclass.com/download/36437924985" },
];
app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});
app.post("/campgrounds", function(req, res) {
    campgrounds.push(req.body);
    res.redirect("/campgrounds");
});
app.get("/campgrounds/new", function(req, res) {
    res.render("newcamp");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Yelp-Camp server started.");
});
