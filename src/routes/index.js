// manage routes
const vocabularyRouter = require('./vocabularies');
const emailRouter = require('./emailRouter');


function route(app) {
  app.use('/vocabulary', vocabularyRouter);
  app.use('/post-email', emailRouter);
}

module.exports = route;