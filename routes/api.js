'use strict';
const mongoose = require('mongoose');
const BookModel = require('../models').Book;
const CommentModel = require('../models').Comment;


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      console.log(req.body)
    })

    .post(function (req, res) {
      let title = req.body.title;
      console.log(req.body)

      if (!title) {
        return res.json("missing required field title");
      }

      const newBook = new BookModel({
        title: title,
        //comments: [],
        //commentcount: 0,
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
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      console.log(req.body)
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.json("missing required field comment")
      }
      console.log(req.body)
      console.log(req.params)
      //json res format same as .get
      BookModel.findById(bookid, (err, doc) => {
        if (err) {
          return res.json("no book exists")
        } else {
          const newComment = new CommentModel({
            content: comment,
            bookid: bookid
          });

          newComment.save((error, data) => {
            if (error || !data) {
              return res.json({ error: "Error saving comment" });
            } else {
              console.log('comment save success')
              return res.json(doc);
            }
          });
        }
      })
    })



    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });

};
