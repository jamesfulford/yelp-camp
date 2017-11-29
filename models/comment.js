var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: String,  // TODO: sanitize
    author: String,  // will be reference to a User
});
var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;