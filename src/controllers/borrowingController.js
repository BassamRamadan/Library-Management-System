
import { sequelize } from '../config/database.js';
import { Borrowing, Book, Borrower } from '../models/index.js';
import { errorHandler } from '../utils/errorHandler.js';

export default {
    borrowing_book: async (req, res) => {
        const { borrowerId, bookId, dueDate } = req.body;
        const t = await sequelize.transaction();
        try {
            const borrower = await Borrower.findByPk(borrowerId, { transaction: t });
            if (!borrower) throw new Error('Borrower not found');

            const book = await Book.findByPk(bookId, { transaction: t, lock: t.LOCK.UPDATE });
            if (!book) throw new Error('Book not found');
            if (book.quantity < 1) throw new Error('Book out of stock');

            const due = dueDate ? new Date(dueDate) : new Date(Date.now() + (Number(process.env.BORROW_DAYS || 14) * 24 * 60 * 60 * 1000));

            const borrowing = await Borrowing.create({
                borrower_id: borrowerId,
                book_id: bookId,
                due_date: due,
                status: 'borrowed'
            }, { transaction: t });

            await book.update({ quantity: book.quantity - 1 }, { transaction: t });

            await t.commit();
            res.status(201).json(borrowing);
        } catch (e) {
            await t.rollback();
            res.status(400).json(errorHandler(e));
        }
    },

    return_book: async (req, res) => {
        const borrowing = await Borrowing.findByPk(req.params.id);
        if (!borrowing) return res.status(404).json({ error: 'Borrowing not found' });
        if (borrowing.returned_date) return res.status(400).json({ error: 'Already returned' });

        const t = await sequelize.transaction();
        try {
            // lock book row for update
            const book = await Book.findByPk(borrowing.book_id, { transaction: t, lock: t.LOCK.UPDATE });
            await borrowing.update({ returned_date: new Date(), status: 'returned' }, { transaction: t });
            await book.update({ quantity: book.quantity + 1 }, { transaction: t });
            await t.commit();
            res.json(borrowing);
        } catch (e) {
            await t.rollback();
            res.status(400).json(errorHandler(e));
        }
    },

    overdue_list: async (req, res) => {
        const now = new Date();
        const { Op } = await import('sequelize');
        const overdue = await Borrowing.findAll({
            where: {
                due_date: { [Op.lt]: now },
                returned_date: null
            },
            include: [Book, Borrower]
        });
        res.json(overdue);
    },

    list_borrowings: async (req, res) => {
        const borrowing = await Borrowing.findAll({
            include: [Book, Borrower]
        });
        res.json(borrowing);
    }
}