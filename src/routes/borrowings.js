import express from 'express';
import { body, param } from 'express-validator';
import { createBorrowingLimiter } from '../middleware/rateLimiters.js';
import { validateRequest } from "../middleware/validateRequest.js";
import borrowingController from "../controllers/borrowingController.js";

const router = express.Router();

// Borrow a book
router.post('/',
  createBorrowingLimiter,
  body('borrowerId').isInt(),
  body('bookId').isInt(),
  body('dueDate').optional().isISO8601(),
  validateRequest,
  borrowingController.borrowing_book
);

// Return a book
router.post('/:id/return',
  param('id').isInt(),
  validateRequest,
  borrowingController.return_book
);

// Overdue list
router.get('/overdue',
  borrowingController.overdue_list
);

// List all borrowings
router.get('/',
  borrowingController.list_borrowings
);

export default router;
