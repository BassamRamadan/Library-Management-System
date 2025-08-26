import { Book } from '../models/index.js';
import { errorHandler } from '../utils/errorHandler.js';
// book_index

export default{
    book_index: async (req, res) => {
        try {
            const books = await Book.findAll();
            res.json(books);
        } catch (e) {
            res.status(500).json(errorHandler(e));
        }
    },

    book_search: async (req, res) => {
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
          res.status(500).json(errorHandler(e));
        }
      },

      book_update: async (req, res) => {
          const book = await Book.findByPk(req.params.id);
          if (!book) return res.status(404).json({ error: 'Book not found' });
          try {
            await book.update(req.body);
            res.json(book);
          } catch (e) {
            res.status(400).json(errorHandler(e));
          }
        },


        book_delete: async (req, res) => {
          const book = await Book.findByPk(req.params.id);
          if (!book) return res.status(404).json({ error: 'Book not found' });
          try {
            await book.destroy();
            res.status(204).send();
          } catch (e) {
            res.status(500).json(errorHandler(e));
          }
        },

        book_create: async (req, res) => {
          try {
            const book = await Book.create(req.body);
            res.status(201).json(book);
          } catch (e) {
            return res.status(400).json(errorHandler(e));
          }
        }
}