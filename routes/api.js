'use strict';
const mongoose = require('mongoose');
const BookModel = require('../models').Book;
const CommentModel = require('../models').Comment;


module.exports = function (app) {
  //used by GET and POST api/books/id 
  const findComments = async (id) => {
    let return_comments = [];
    //below must process first BEFORE returning the array [else, you just get the original empty array]
    await CommentModel.find({ bookid: id }, (error, docs) => {
      if (error) {
        return res.json("error loading comments");
      } else {
        docs.forEach(ele => {
          return_comments.push(ele.content);
        });
      }
    })
    return return_comments;
  }

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      console.log(req.body);
      let returnArr = [];

      BookModel.find({}, async (err, docs) => {
        if (err) {
          return res.json('error loading books');
        } else {
          console.log(docs);
          //await here and do not procede to return statement until the Promise is fulfilled
          await Promise.all(docs.map(async (book) => {
            returnArr.push({
              _id: book._id,
              title: book.title,
              commentcount: await CommentModel.where({ bookid: book._id }).countDocuments().exec()
              //need to await above or you'll just get an empty object for commentcount
            });
          }));
          return res.json(returnArr);
        }
      })
    })

    .post(function (req, res) {
      let title = req.body.title;
      console.log(req.body)
      if (!title) {
        return res.json("missing required field title");
      }
      const newBook = new BookModel({
        title: title,
      });

      newBook.save((err, data) => {
        if (err || !data) {
          return res.json({ error: "Error saving post" });
        } else {
          console.log('book save success')
          return res.json(newBook);
        }
      });
    })


    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      console.log(req.body)
      //pass in empty object {} to match ALL books
      BookModel.deleteMany({}, (err, data) => {
        if (err) {
          return res.json("error deleting all");
        } else {
          return res.json('complete delete successful');
        }
      })
    });


  app.route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.json("no book exists");
      }
      //first make sure book exists...
      await BookModel.findById(bookid, async (err, doc) => {
        if (err || !doc) {
          return res.json("no book exists");
        } else {
          //find each comment with matching bookid, and push to array
          let return_comments = [];
          return_comments = await findComments(bookid);
          return res.json({ _id: bookid, title: doc.title, comments: return_comments });
        }
      })
    })


    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.json("missing required field comment")
      }
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.json("no book exists");
      }
      BookModel.findById(bookid, (err, doc) => {
        if (err || !doc) {
          return res.json("no book exists")
        } else {
          const newComment = new CommentModel({
            content: comment,
            bookid: bookid
          });

          newComment.save(async (error, data) => {
            if (error || !data) {
              return res.json({ error: "Error saving comment" });
            } else {
              console.log('comment save success')
              let commentArray = [];
              commentArray = await findComments(bookid);
              console.log({ _id: bookid, title: doc.title, comments: commentArray })
              return res.json({ _id: bookid, title: doc.title, comments: commentArray });
            }
          });
        }
      })
    })


    .delete(function (req, res) {
      let bookid = req.params.id;
      BookModel.findByIdAndDelete(bookid, (err, doc) => {
        if (err || !doc) {
          return res.json("no book exists")
        } else {
          return res.json('delete successful')
        }
      });
    })
};
