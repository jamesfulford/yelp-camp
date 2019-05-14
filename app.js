// Dependencies
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var express = require("express");
var passport = require("passport");
var flash = require("connect-flash");
var localStrategy = require("passport-local");

// Models
var User = require("./models/user");
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
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "jellyjellyjellyfish",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

//
// Pre-server
//

var seedDB = require("./seeds");
seedDB();


//
// PASSPORT CONFIGURATION
//
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Universal Middleware
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;  // every ejs now has access to currentUser
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//
// Routes
//
app.use(require("./routes/index"));
app.use(require("./routes/auth"));
app.use("/campgrounds", require("./routes/campgrounds"));
app.use("/campgrounds/:id/comments", require("./routes/comments"));


//
// Serving
//
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Yelp-Camp server started.");
});
