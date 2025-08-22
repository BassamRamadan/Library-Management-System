import rateLimit from 'express-rate-limit';

export const createBookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: 'Too many book creations from this IP, please try again later.' }
});

export const createBorrowingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many borrow attempts, please try again later.' }
});
