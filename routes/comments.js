var router = require("express").Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

//
// Nested Comments Routes
//

// NEW
router.get("/new", isLoggedIn, function(req, res) {
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
router.post("/", isLoggedIn, function(req, res) {
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

module.exports = router;
