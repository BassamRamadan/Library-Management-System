import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectWithRetry, sequelize } from './config/database.js';
import { requireBasicAuth } from './middleware/auth.js';
import booksRouter from './routes/books.js';
import borrowersRouter from './routes/borrowers.js';
import borrowingsRouter from './routes/borrowings.js';
import reportsRouter from './routes/reports.js';
import './models/index.js'; // ensure models are registered
import { errorHandler } from './utils/errorHandler.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Basic auth for all routes
app.use(requireBasicAuth);

// Routes
app.use('/books', booksRouter);
app.use('/borrowers', borrowersRouter);
app.use('/borrowings', borrowingsRouter);
app.use('/reports', reportsRouter);

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json(errorHandler(err));
});

const port = Number(process.env.PORT || 3000);

(async () => {
  await connectWithRetry();
  await sequelize.sync();
  app.listen(port, () => console.log(`API running on port ${port}`));
})();
