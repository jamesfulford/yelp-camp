var router = require("express").Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("./_middleware");

//
// Nested Comments Routes
//

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
router.post("/", middleware.isLoggedIn, function(req, res) {
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
                    // add username and id into comment
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    // save comment
                    comment.save();
                    
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

// EDIT
router.get("/:commentId/edit", middleware.commentOwnershipMatches, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        Comment.findById(req.params.commentId, function (err, comment) { 
            if (err) {
                console.log(err);
                return res.redirect("back");
            }
            res.render("comments/edit", { campground: campground, comment: comment });
        });
    });
});

// UPDATE
router.put("/:commentId", middleware.commentOwnershipMatches, function (req, res) {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function (err, comment) {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        res.redirect("/campgrounds/" + req.params.id)
    });
});

// DELETE
router.delete("/:commentId", middleware.commentOwnershipMatches, function (req, res) {
    Comment.findByIdAndRemove(req.params.commentId, function (err, comment) {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        res.redirect("/campgrounds/" + req.params.id);
    });
})

module.exports = router;
