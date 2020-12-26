const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

// MiddleWares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use('/graphql', graphqlHTTP({}));

app.get('/', (req, res, next) => {
  res.json('Hello World');
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
