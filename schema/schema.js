const graphql = require('graphql');
const _ = require('lodash');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;

// dummy data
let books = [
  { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
  { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
  { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
  { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
  { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
  { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
];

let authors = [
  { name: 'Patrick Rothfuss', age: 44, id: '1' },
  { name: 'Brandon Sanderson', age: 42, id: '2' },
  { name: 'Terry Pratchett', age: 66, id: '3' },
];

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
        return _.find(authors, { id: parent.authorId });
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
        return _.filter(books, { authorId: parent.id });
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
        return _.find(books, { id: args.id });
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      },
    },
    // RootQuery to get a list of ALL books
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      },
    },
  },
});

// We define a new GraphQL Schema and passing in options defining which query the user
// can use to retreive data from the frontend
module.exports = new GraphQLSchema({
  query: RootQuery,
});

// EXAMPLE FRONTEND QUERY
// {

//   book(id: "1") {
//     id
//     name
//     genre
//   }
// }
