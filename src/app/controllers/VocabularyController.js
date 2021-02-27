// function handler: do something when path matched

const Vocabulary = require('../models/Vocabulary');

class VocabularyController {
  // [GET] /vocabulary
  index(req, res) {
    Vocabulary.find({}, function(err, vocabularies) {
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
    const vocabulary = new Vocabulary(req.body);
    vocabulary.save().then(saveDoc => {
      res.json(saveDoc);
    })
  }
  // [DELETE] /vocabulary
  delete(req, res) {
    Vocabulary.deleteOne({ _id: req.params.id}, function (err) {
      if(err) res.json(err);
    })
  }
  // [PATCH] /vocabulary
  update(req, res) {
    Vocabulary.updateOne({ _id: req.params.id}, req.body)
      .then(doc => {
        res.json(doc);
      })
  }
}

module.exports = new VocabularyController();
