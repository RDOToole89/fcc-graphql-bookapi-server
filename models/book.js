const mongoose = require('mongoose');
// import mongoose.Schema to create "blueprint"
const Schema = mongoose.Schema;

// new Schema refers to our imported Schema
// bookSchema is the bluePrint for what a book entity looks like
// id does not have to be defined because MongoDB automatically creates it for each book
const bookSchema = new Schema({
  name: String,
  genre: String,
  authorId: String,
});

// collection model is named "Book" and is based on the bookSchema
// model refers to a collection in a database
module.exports = mongoose.model('Book', bookSchema);
