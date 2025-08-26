import express from 'express';
import { body, query, param } from 'express-validator';
import { createBookLimiter } from '../middleware/rateLimiters.js';
import bookController  from '../controllers/bookController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.post('/',
  createBookLimiter,
  body('title').isString().notEmpty(),
  body('author').isString().notEmpty(),
  body('isbn').isString().notEmpty(),
  body('quantity').isInt({ min: 0 }),
  validateRequest,
  bookController.book_create
);

router.get('/', bookController.book_index)

router.get('/search',
  query('title').optional().isString(),
  query('author').optional().isString(),
  query('isbn').optional().isString(),
  validateRequest,
  bookController.book_search
);

router.put('/:id',
  param('id').isInt(),
  body('title').optional().isString(),
  body('author').optional().isString(),
  body('isbn').optional().isString(),
  body('quantity').optional().isInt({ min: 0 }),
  validateRequest,
  bookController.book_update
);

router.delete('/:id', 
  param('id').isInt(), 
  validateRequest,
  bookController.book_delete);

export default router;
