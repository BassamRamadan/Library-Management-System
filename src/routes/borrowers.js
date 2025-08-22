import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { Borrower, Borrowing, Book } from '../models/index.js';

const router = express.Router();

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

router.post('/',
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  async (req, res) => {
    const err = handleValidation(req, res); if (err) return;
    try {
      const borrower = await Borrower.create(req.body);
      res.status(201).json(borrower);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

router.get('/', async (req, res) => {
  const borrowers = await Borrower.findAll();
  res.json(borrowers);
});

router.put('/:id',
  param('id').isInt(),
  body('name').optional().isString(),
  body('email').optional().isEmail(),
  async (req, res) => {
    const err = handleValidation(req, res); if (err) return;
    const borrower = await Borrower.findByPk(req.params.id);
    if (!borrower) return res.status(404).json({ error: 'Borrower not found' });
    try {
      await borrower.update(req.body);
      res.json(borrower);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

router.delete('/:id', param('id').isInt(), async (req, res) => {
  const borrower = await Borrower.findByPk(req.params.id);
  if (!borrower) return res.status(404).json({ error: 'Borrower not found' });
  await borrower.destroy();
  res.status(204).send();
});

// List currently borrowed books by borrower
router.get('/:id/books', param('id').isInt(), async (req, res) => {
  const borrower = await Borrower.findByPk(req.params.id);
  if (!borrower) return res.status(404).json({ error: 'Borrower not found' });
  const borrowings = await Borrowing.findAll({
    where: { borrower_id: borrower.id, returned_date: null },
    include: [Book]
  });
  res.json(borrowings);
});

export default router;
