var router = require("express").Router({mergeParams: true});

var User = require("../models/user");

var passport = require("passport");

//
// AUTH Routes
//

// sign up form
router.get("/register", function(req, res) {
    res.render("register");
});

// signup functionality
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
     User.register(newUser, req.body.password, function(err, user) {
         if(err) {
             console.log(err);
             req.flash("error", err.message);
             res.render("register");
             return
         }
         passport.authenticate("local")(req, res, function() {
            req.flash("success", "Successfully logged in");
            res.redirect("/campgrounds");
         })
     });
});

// login page
router.get("/login", function(req, res) {
    res.render("login");
});
// login logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
    req.flash("success", "Successfully logged in");
});

// logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/campgrounds");
});

module.exports = router;
