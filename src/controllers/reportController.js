import { Op } from 'sequelize';
import { Parser as Json2CsvParser } from 'json2csv';
import { Borrowing, Book, Borrower } from '../models/index.js';

function lastMonthRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
    // last month from today's date 
    return { start, end };
}

async function getBorrowings(filter) {
    return Borrowing.findAll({
        where: filter,
        include: [Book, Borrower],
        order: [['borrowed_date', 'ASC']]
    });
}

function toRows(items) {
    return items.map(b => ({
        borrowing_id: b.id,
        borrower_id: b.borrower_id,
        borrower_name: b.Borrower?.name,
        borrower_email: b.Borrower?.email,
        book_id: b.book_id,
        book_title: b.Book?.title,
        book_author: b.Book?.author,
        book_isbn: b.Book?.isbn,
        borrowed_date: b.borrowed_date,
        due_date: b.due_date,
        returned_date: b.returned_date,
        status: b.status
    }));
}

const fields = [
    "borrowing_id",
    "borrower_id",
    "borrower_name",
    "borrower_email",
    "book_id",
    "book_title",
    "book_author",
    "book_isbn",
    "borrowed_date",
    "due_date",
    "returned_date",
    "status"
];

export default {
    list_borrowings: async (req, res) => {
        const { start, end } = lastMonthRange();
        console.log("Fetching borrowings from", start, "to", end);
        const items = await getBorrowings({ borrowed_date: { [Op.gte]: start, [Op.lte]: end } });
        const rows = toRows(items);
        const parser = new Json2CsvParser({ fields });
        const csv = parser.parse(rows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="borrowings_last_month.csv"');
        res.send(csv);
    },

    list_overdues: async (req, res) => {
        const { start, end } = lastMonthRange();
        const items = await getBorrowings({
            borrowed_date: { [Op.gte]: start, [Op.lte]: end },
            returned_date: null,
            due_date: { [Op.lt]: new Date() }
        });
        const rows = toRows(items);
        const parser = new Json2CsvParser({ fields });
        const csv = parser.parse(rows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="overdue_last_month.csv"');
        res.send(csv);
    }
}

