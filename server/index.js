const express = require('express');
const dotenv = require('dotenv');

const DB = require('./database/index');

dotenv.config({ silent: true });

const app = express();
const PORT = process.env.PORT || 8085;

require('./authentication')(app);

app.use((req, _, next) => {
  console.info(`${req.method}:${req.url}`);
  next();
});


app.listen(PORT, () => {
  console.info(`Server started on port ${PORT}`);
});
