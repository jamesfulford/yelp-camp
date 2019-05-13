var Campground = require("../models/campground");

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function campgroundOwnershipMatches(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect("back");
        return
    }

    Campground.findById(req.params.id).exec(function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            if (campground.author.id.equals(req.user._id)) {
                next();
                return;
            } else {
                console.log(req.user._id, "is not the author of campground", campground.id, "; not allowed to edit.");
                res.redirect("back");
            }
        }
    });
}

module.exports = {
    isLoggedIn: isLoggedIn,
    campgroundOwnershipMatches: campgroundOwnershipMatches,
}