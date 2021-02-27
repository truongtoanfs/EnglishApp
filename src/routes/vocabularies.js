// manage vocabulary routes
const express = require('express');
const router = express.Router();

const vocabularyController = require('../app/controllers/VocabularyController');


router.get('/', vocabularyController.index);
router.post('/', vocabularyController.store);
router.delete('/:id', vocabularyController.delete);
router.patch('/:id', vocabularyController.update);

module.exports = router;
