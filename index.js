const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4000;

// Mongoose setup - creates an instance of MongoDB
mongoose.connect(
  'mongodb+srv://roibinotoole:test@gql-free.g52o7.mongodb.net/GQL-BOOK-API?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.connection.once('open', () => console.log('connected to database'));

// MiddleWares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    // adds initial schema / defines the Graph
    schema,
    // adds graphiql tool to interact with graph
    graphiql: true,
  })
);

app.get('/', (req, res, next) => {
  res.json('Hello World');
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
