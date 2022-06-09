'use strict';
const mongoose = require('mongoose');
const BookModel = require('../models').Book;
const CommentModel = require('../models').Comment;


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      console.log(req.body);
      let returnArr = [];
      // run()
      // async function run() {
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
      //};
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
    });


  //http://localhost:3000/api/books/62a16eb130ae763a98330cfb
  //empty:  http://localhost:3000/api/books/62a1748a431d7a4ca8761958
  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      console.log(req.body);
      //first make sure book exists...
      BookModel.findById(bookid, (err, doc) => {
        if (err) {
          return res.json("no book exists");
        } else {
          const return_title = doc.title;
          //...then find each comment with matching bookid, and push to array
          CommentModel.find({ bookid: bookid }, (error, docs) => {
            if (error) {
              return res.json("error loading comments");
            } else {
              console.log(docs);
              let return_comments = [];
              docs.forEach(ele => {
                return_comments.push(ele.content);
              });
              return res.json({ _id: bookid, title: return_title, comments: return_comments });
            }
          })
        }
      })
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
