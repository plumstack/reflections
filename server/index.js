const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// routes
const dashCohortsRoute = require('./routes/dash/cohorts');
const dashStudentRoute = require('./routes/dash/student');
const dashReflectionRoute = require('./routes/dash/reflection');
const dashTagsRoute = require('./routes/dash/tags');

require('./api/slack');

dotenv.config({ silent: true });
const { BASE_URL } = process.env;

const app = express();
const PORT = process.env.PORT || 8085;
app.use(bodyParser.json());
app.use((req, _, next) => {
  console.log(`${req.method}:${req.url}`);
  next();
});

if (process.env.BUILD === 'PRODUCTION') {
  app.use('/reflections', express.static(`${__dirname}/../dist`));
}

require('./authentication')(app);

app.use(`${BASE_URL}api/dash/cohorts`, dashCohortsRoute);
app.use(`${BASE_URL}api/dash/student`, dashStudentRoute);
app.use(`${BASE_URL}api/dash/reflection/`, dashReflectionRoute);
app.use(`${BASE_URL}api/dash/tags/`, dashTagsRoute);


app.listen(PORT, () => {
  console.info(`Server started on port ${PORT}`);
});
