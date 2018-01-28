var router = require("express").Router({mergeParams: true});

var Campground = require("../models/campground");



function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


//
// Campgrounds
//

// INDEX
router.get("/", function(req, res) {
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
router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// CREATE
router.post("/", isLoggedIn, function(req, res) {
    // Add to database, redirect to campgrounds
    var newCampground = {
        name: req.body.campground.name,
        image: req.body.campground.image,
        description: req.body.campground.description,  // TODO: sanitize
        author: {
            username: req.user.username,
            id: req.user._id,
        }
    };
    Campground.create(newCampground,
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
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {campground: campground});    
        }
    });
});

module.exports = router;