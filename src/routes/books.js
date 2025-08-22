import express from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { Book } from '../models/index.js';
import { createBookLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

router.post('/',
  createBookLimiter,
  body('title').isString().notEmpty(),
  body('author').isString().notEmpty(),
  body('isbn').isString().notEmpty(),
  body('quantity').isInt({ min: 0 }),
  async (req, res) => {
    const err = handleValidation(req, res); if (err) return;
    try {
      const book = await Book.create(req.body);
      res.status(201).json(book);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

router.get('/', async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

router.get('/search',
  query('title').optional().isString(),
  query('author').optional().isString(),
  query('isbn').optional().isString(),
  async (req, res) => {
    const { title, author, isbn, ...rest } = req.query;
    const { Op } = await import('sequelize');

    // Reject unexpected query parameters
    if (Object.keys(rest).length > 0) {
      return res.status(400).json({ error: `Invalid query params: ${Object.keys(rest).join(', ')}` });
    }

    // Build where conditions
    const where = {};
    if (title) where.title = { [Op.iLike]: `%${title}%` };
    if (author) where.author = { [Op.iLike]: `%${author}%` };
    if (isbn) where.isbn = isbn;

    try {
      const books = await Book.findAll({ where });
      res.json(books);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

router.put('/:id',
  param('id').isInt(),
  body('title').optional().isString(),
  body('author').optional().isString(),
  body('isbn').optional().isString(),
  body('quantity').optional().isInt({ min: 0 }),
  async (req, res) => {
    const err = handleValidation(req, res); if (err) return;
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    try {
      await book.update(req.body);
      res.json(book);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

router.delete('/:id', param('id').isInt(), async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  await book.destroy();
  res.status(204).send();
});

export default router;
