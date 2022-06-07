const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
   title: { type: String, required: true },
   //comments: { type: Array },
   //commentcount: { type: Number },
});

const Book = mongoose.model("Book", BookSchema);
exports.Book = Book;