const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
   content: { type: String, required: true },
   bookid: { type: String, required: true },
});

const BookSchema = new mongoose.Schema({
   title: { type: String, required: true },
   //comments: { type: Array },
   //commentcount: { type: Number },
});

const Comment = mongoose.model("Comment", commentSchema);
exports.Comment = Comment;
const Book = mongoose.model("Book", BookSchema);
exports.Book = Book;