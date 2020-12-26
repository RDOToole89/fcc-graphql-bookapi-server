const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

// MiddleWares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.get('/', (req, res, next) => {
  res.json('Hello World');
});

server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
