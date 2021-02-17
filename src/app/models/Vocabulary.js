// Defining a Model for database

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Vocabulary = new Schema({
  answer: String,
  image: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Vocabulary', Vocabulary);
