var router = require("express").Router({ mergeParams: true });
 
router.get("/", function(req, res) {
    res.render("landing");
});

module.exports = router;
