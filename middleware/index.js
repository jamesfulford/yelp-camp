var Campground = require("../models/campground");
var Comment = require("../models/comment");

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must login first");
    res.redirect("/login");
}

function campgroundOwnershipMatches(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in");
        res.redirect("back");
        return
    }

    Campground.findById(req.params.id).exec(function(err, campground) {
        if(err) {
            console.log(err);
            req.flash("error", "Could not find campground");
            res.redirect("back");
        } else {
            if (campground.author.id.equals(req.user._id)) {
                next();
                return;
            } else {
                console.log(req.user._id, "is not the author of campground", campground.id);
                req.flash("error", "You are not authorized to manage this campground");
                res.redirect("back");
            }
        }
    });
}

function commentOwnershipMatches(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in");
        res.redirect("back");
        return
    }

    Comment.findById(req.params.commentId).exec(function(err, comment) {
        if(err) {
            console.log(err);
            req.flash("error", "Could not find comment");
            res.redirect("back");
        } else {
            if (comment.author.id.equals(req.user._id)) {
                next();
                return;
            } else {
                console.log(req.user._id, "is not the author of comment", comment.id);
                req.flash("error", "You are not authorized to manage this comment");
                res.redirect("back");
            }
        }
    });
}


module.exports = {
    isLoggedIn: isLoggedIn,
    campgroundOwnershipMatches: campgroundOwnershipMatches,
    commentOwnershipMatches: commentOwnershipMatches,
}