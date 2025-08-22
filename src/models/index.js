import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Book = sequelize.define('Book', {
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  isbn: { type: DataTypes.STRING, allowNull: false, unique: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
  shelf_location: { type: DataTypes.STRING }
}, {
  tableName: 'books',
  indexes: [
    { fields: ['isbn'] },
    { fields: ['title'] },
    { fields: ['author'] }
  ]
});

export const Borrower = sequelize.define('Borrower', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  registered_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  tableName: 'borrowers'
});

export const Borrowing = sequelize.define('Borrowing', {
  borrowed_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  due_date: { type: DataTypes.DATE, allowNull: false },
  returned_date: { type: DataTypes.DATE, allowNull: true },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'borrowed' }
}, {
  tableName: 'borrowings',
  indexes: [{ fields: ['due_date'] }]
});

// Associations
Borrower.hasMany(Borrowing, { foreignKey: 'borrower_id', onDelete: 'CASCADE' });
Borrowing.belongsTo(Borrower, { foreignKey: 'borrower_id' });

Book.hasMany(Borrowing, { foreignKey: 'book_id', onDelete: 'CASCADE' });
Borrowing.belongsTo(Book, { foreignKey: 'book_id' });
