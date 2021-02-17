// function handler: do something when path matched

const Vocabulary = require('../models/Vocabulary');

class VocabularyController {
  // [GET] /vocabulary
  index(req, res) {
    Vocabulary.find({}, function (err, vocabularies) {
      if (!err) {
        res.json(vocabularies);
      }
      else {
        res.status(500).json({ error: 'cannot get data' });
      }
    });
  }
  // [POST] /vocabulary
  store(req, res) {
    //res.json(req.body);
    const vocabulary = new Vocabulary(req.body);
    vocabulary.save();
    console.log('vocabulary saved!!!!!');
  }
}

module.exports = new VocabularyController();
