# Personal Library

This is the boilerplate for the Personal Library project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/personal-library

subdoc thread:
https://stackoverflow.com/questions/71230787/mongodb-subdocument-structure-best-practices-and-queries

setting up database:
```javascript
require('dotenv').config();
const mongoose = require("mongoose");

const URI = process.env.DB;
const db = mongoose.connect(URI, {
    useUnifiedTopology:true,
    useNewUrlParser: true
})
module.exports = db;
```


resolve promise:
```javascript
//first declare async in outer function
const placeHolder = async function  {
    await functionName()
    //wait until the above is done
}

//await here and do not procede to return statement until the Promise is fulfilled
await Promise.all(docs.map(async (book) => {
returnArr.push({
    _id: book._id,
    title: book.title,
    commentcount: await CommentModel.where({ bookid: book._id }).countDocuments().exec()
    //need to await above or you'll just get an empty object for commentcount
});
}));

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
```