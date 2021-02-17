// manage vocabulary routes
const express = require('express');
const router = express.Router();

const vocabularyController = require('../app/controllers/VocabularyController');


router.get('/', vocabularyController.index);
router.post('/', vocabularyController.store);

module.exports = router;
