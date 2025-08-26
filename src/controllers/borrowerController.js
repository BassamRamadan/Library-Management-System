
import { Borrower, Borrowing, Book } from '../models/index.js';
import { errorHandler } from '../utils/errorHandler.js';

export default {
    borrower_create: async (req, res) => {
        try {
            const borrower = await Borrower.create(req.body);
            res.status(201).json(borrower);
        } catch (e) {
            res.status(400).json(errorHandler(e));
        }
    },

    borrower_list: async (req, res) => {
        const borrowers = await Borrower.findAll();
        res.json(borrowers);
    },

    borrower_update: async (req, res) => {
        const borrower = await Borrower.findByPk(req.params.id);
        if (!borrower) return res.status(404).json({ error: 'Borrower not found' });
        try {
            await borrower.update(req.body);
            res.json(borrower);
        } catch (e) {
            res.status(400).json(errorHandler(e));
        }
    },

    borrower_delete: async (req, res) => {
        const borrower = await Borrower.findByPk(req.params.id);
        if (!borrower) return res.status(404).json({ error: 'Borrower not found' });
        await borrower.destroy();
        res.status(204).send();
    },

    // List currently borrowed books by borrower
    borrower_books: async (req, res) => {
        const borrower = await Borrower.findByPk(req.params.id);
        if (!borrower) return res.status(404).json({ error: 'Borrower not found' });
        const borrowings = await Borrowing.findAll({
            where: { borrower_id: borrower.id, returned_date: null },
            include: [Book]
        });
        res.json(borrowings);
    }
}