var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: String,  // TODO: sanitize
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String // could look up, but it's faster if we cache it here
    },
});
var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;