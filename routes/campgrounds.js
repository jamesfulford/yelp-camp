var router = require("express").Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

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
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
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
        } else if (!campground) {
            console.log("Campground " + req.params.id + " not found!");
            res.redirect("/campgrounds");
        } else {
            console.log(campground)
            res.render("campgrounds/show", {campground: campground});    
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.campgroundOwnershipMatches, function (req, res) {
    Campground.findById(req.params.id).exec(function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", { campground: campground });
        }
    });
});

// UPDATE
router.put("/:id", middleware.campgroundOwnershipMatches, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
       if (err) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

// DESTROY
router.delete("/:id", middleware.campgroundOwnershipMatches, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    })
});

module.exports = router;
