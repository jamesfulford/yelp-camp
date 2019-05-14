var router = require("express").Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//
// Nested Comments Routes
//

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            req.flash("error", "Cannot add comments at this time");
            res.redirect("/campgrounds/" + req.params.id);
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
            req.flash("error", "Could not find campground");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                    req.flash("error", "Could not add your comment at this time");
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
                            req.flash("error", "Could not add your comment at this time");
                        } else {
                            req.flash("success", "Thanks for commenting!");
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
            req.flash("error", "Could not find campground");
            return res.redirect("back");
        }
        Comment.findById(req.params.commentId, function (err, comment) { 
            if (err) {
                console.log(err);
                req.flash("error", "Could not find comment");
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
            req.flash("error", "Could not update your comment at this time");
            return res.redirect("back");
        }
        req.flash("success", "Successfully updated your comment");
        res.redirect("/campgrounds/" + req.params.id)
    });
});

// DELETE
router.delete("/:commentId", middleware.commentOwnershipMatches, function (req, res) {
    Comment.findByIdAndRemove(req.params.commentId, function (err, comment) {
        if (err) {
            console.log(err);
            req.flash("error", "Could not delete your comment at this time");
            return res.redirect("back");
        }
        req.flash("success", "Successfully deleted your comment");
        res.redirect("/campgrounds/" + req.params.id);
    });
})

module.exports = router;
