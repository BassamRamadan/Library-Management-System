import express from 'express';
import reportController from "../controllers/reportController.js";
const router = express.Router();

router.get('/last-month/borrowings.csv', reportController.list_borrowings);

router.get('/last-month/overdue.csv', reportController.list_overdues);

export default router;
