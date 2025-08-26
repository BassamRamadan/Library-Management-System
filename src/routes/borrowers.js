import express from 'express';
import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';
import borrowerController from '../controllers/borrowerController.js';

const router = express.Router();

router.post('/',
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  validateRequest,
  borrowerController.borrower_create
);

router.get('/', borrowerController.borrower_list);

router.put('/:id',
  param('id').isInt(),
  body('name').optional().isString(),
  body('email').optional().isEmail(),
  validateRequest,
  borrowerController.borrower_update
);

router.delete('/:id', 
  param('id').isInt(), 
  validateRequest, 
  borrowerController.borrower_delete
);

// List currently borrowed books by borrower
router.get('/:id/books', 
  param('id').isInt(), 
  validateRequest,
  borrowerController.borrower_books
);
export default router;
