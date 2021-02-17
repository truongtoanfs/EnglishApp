// manage routes
const vocabularyRouter = require('./vocabularies');


function route(app) {
  app.use('/vocabulary', vocabularyRouter);
}

module.exports = route;