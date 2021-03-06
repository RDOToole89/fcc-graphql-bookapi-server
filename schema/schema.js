const graphql = require('graphql');
const _ = require('lodash');
// Imports MongoDB models to interact with the Database
const Book = require('../models/book');
const Author = require('../models/author');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  // GraphQL List
  GraphQLList,
  // GraphQL propery to not allow Null values
  GraphQLNonNull,
} = graphql;

// Schema Type that defines data object type which defines "Book"
const BookType = new GraphQLObjectType({
  name: 'Book',
  // fiels are wrapped in a function to prevent namespace errors
  fields: () => ({
    // id: { type: GraphQLString },
    // GraphQLID type lets you use either a string or an int as an identifier for a query
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    // defines relation with author type many => 1
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // parent object holds the Book object
        console.log(parent);
        // return _.find(authors, { id: parent.authorId });
        return Author.findById(parent.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      //  defines relation with book type 1 => many therefore we use GraphQLList
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        console.log(parent);
        // return _.filter(books, { authorId: parent.id });
        // .find is a mongoose method to return all entries with a given criteria
        return Book.find({ authorId: parent.id });
      },
    },
  }),
});

// Schema Type that defines how you will query a GraphQLData or jump into the Graph
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      // Defines the type of data
      type: BookType,
      // args is the identifier that we expect to receive in order to fullfull a query
      // in this case an id which is a string.
      // this data will fire the resolve function which will deliver our data
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / other source
        // lodash function defines what will be returned from the frontend request
        // return _.find(books, { id: args.id });
        return Book.findById(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(authors, { id: args.id });
        return Author.findById(args.id);
      },
    },
    // RootQuery to get a list of ALL books
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books;
        // here we want to return all Books so Book.find({}) return ALL books
        return Book.find({});
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authors;
        return Author.find({});
      },
    },
  },
});

// Mutations allow for creating new data on a Graph
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // addAuthor is the name we use on the frontend to create a new author
    addAuthor: {
      type: AuthorType,
      args: {
        // new GraphQLNonNull prevents mutations taking place that if a property has a null value
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        // mongoose model which is imported which creates a new instance of that datatype
        // create a new author where the args are user input
        console.log(args);
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        // .save() is a mongoose functions which allows you to simply save a new author to the db
        // return author.save() to receive back newly added data
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        // we create a new book with the Book model we imported
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        return book.save();
      },
    },
  },
});

// We define a new GraphQL Schema and passing in options defining which query the user
// can use to retreive data from the frontend
module.exports = new GraphQLSchema({
  // qeury tells GraphQL it can use our RootQuery schema to query data
  query: RootQuery,
  // mutation tells GraphQL is can use our Mutation schema to create data
  mutation: Mutation,
});

//EXAMPLE MUTATION QUERY ON THE FRONTEND

// mutation {
//   addAuthor(name:"Roibin", age: 31) {
//     name
//     age
//   }
// }

// EXAMPLE ROOTQUERY ON THE FRONTEND

// find book with specific id, include name, genre and nest author with name and his other books
// {
//   book(id: "5fe8986bf1026a4266d5902a") {
//     name
//     genre
//     author{
//       name
//       books {
//         name
//       }

//     }
//   }
// }
