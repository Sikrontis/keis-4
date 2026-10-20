const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const rentalController = require('../controllers/rentalController');
const authMiddleware = require('../middleware/auth');

// Книги: фильтрация, сортировка
router.get('/books', bookController.getBooks);
router.post('/books', authMiddleware.requireAdmin, bookController.createBook);
router.put('/books/:id', authMiddleware.requireAdmin, bookController.updateBook);
router.delete('/books/:id', authMiddleware.requireAdmin, bookController.deleteBook);

// Аренда и покупка
router.post('/rent', rentalController.rentBook);
router.post('/buy', rentalController.buyBook);

module.exports = router;
