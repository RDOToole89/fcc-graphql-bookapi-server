const graphql = require('graphql');
const { argsToArgsConfig } = require('graphql/type/definition');

const { GraphQLObectType, GraphQLString, GraphQLSchema } = graphql;

// dummy data
let books = [
  { name: 'Name of the Wind', genre: 'Fantasy', id: '1' },
  { name: 'The Final Empire', genre: 'Fantasy', id: '2' },
  { name: 'The Long Earth', genre: 'Sci-Fi', id: '3' },
];

// Schema Type that defines data object type which defines "Book"
const BookType = new GraphQLObectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }),
});

// Schema Type that defines how you will query a GraphQLData or jump into the Graph
const RootQuery = new GraphQLObectType({
  name: 'RootQueryType',
  fields: {
    book: {
      // Defines the type of data
      type: BookType,
      // args is the identifier that we expect to receive in order to fullfull a query
      // in this case an id which is a string.
      // this data will fire the resolve function which will deliver our data
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        // code to get data from db / other source
      },
    },
  },
});

// Example frontend query
// book(id: "123") {
//   name
//   genre
// }

// We define a new GraphQL Schema and passing in options defining which query the user
// can use to retreive data from the frontend
module.exports = new GraphQLSchema({
  query: RootQuery,
});
