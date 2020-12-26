const graphql = require('graphql');

const { GraphQLObectType, GraphQLString } = graphql;

const BookType = new GraphQLObectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }),
});
