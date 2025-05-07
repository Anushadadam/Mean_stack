const express = require('express');
const router = express.Router();
const personController = require('../controllers/personController');

// API Routes
router.get('/', personController.listPeople);
router.post('/', personController.createPerson);

// HTML Form Routes
router.get('/create', personController.createPersonForm);
router.get('/:id/edit', personController.editPersonForm);
router.get('/:id/delete', personController.deletePersonForm);

// API + Form Routes
router.put('/:id', personController.updatePerson);
router.delete('/:id', personController.deletePerson);

module.exports = router;
