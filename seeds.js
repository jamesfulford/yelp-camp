var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelpcamp", { useMongoClient: true });

var Comment = require("./models/comment");
var Campground = require("./models/campground");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/lake-wanaka-from-mou-waho-new-zealand-joan-carroll.jpg",
        description: "Resting place of sky-high wanderers. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        author: {
            id : "588c2e092403d111454fff71",
            username: "Jill",
        },
    },
    {
        name: "Lake Kela",
        image: "https://www.bing.com/images/search?view=detailV2&ccid=OcikxXQr&id=D97BB2113101DD2BE7FE7AE21FF3D64AEA9BAC07&thid=OIP.OcikxXQrY4Q9Zy-EtngRhQEsCw&mediaurl=http%3a%2f%2fwww.onelifeonewhistler.com%2fwp-content%2fuploads%2f2013%2f09%2fLower-Smp-Lake.jpg&exph=3248&expw=5508&q=lake&simid=607990405489233841&selectedIndex=3",
        description: "Pondering pool of profound penguins. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        author: {
            id : "588c2e092403d111454fff71",
            username: "Jill",
        },
    },
    {
        name: "Rake Farm",
        image: "https://tse1.mm.bing.net/th?id=OIP.ebvpy14zCEz-Q8u3bHQR2gEgDY&w=255&h=191&c=7&qlt=90&o=4&dpr=2&pid=1.7",
        description: "Ol' Farm for Ol' Rakes! Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        author: {
            id : "498c2e092403d111454fff22",
            username: "Jack",
        },
    },
];

function seedDB() {
    Campground.remove({}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Removed campgrounds");
            data.forEach(function(seed) {
                Campground.create(seed, function(err, newCamp) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Added " + newCamp.name);
                        Comment.create({
                            text: "No internet access",
                            author: {
                                id : "498c2e092403d111454fff22",
                                username: "Jack",
                            },
                        }, function(err, comment) {
                            if(err) {
                                console.log(err);
                            } else {
                                newCamp.comments.push(comment);
                                newCamp.save();
                                console.log("Created comment");
                            }
                        });
                    }
                });
            });
        }
    }); 
}

module.exports = seedDB;
